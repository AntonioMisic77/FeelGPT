# Memory Management Issue: Profile Picture Storage

## Executive Summary

This document outlines critical memory management concerns related to the current implementation of profile picture storage in the FeelGPT backend. The current approach uses in-memory storage via multer, which poses significant risks to application stability, scalability, and security.

**Severity:** HIGH  
**Status:** Needs Immediate Attention  
**Affected Version:** 1.2.0  
**Last Updated:** 2025-11-07

---

## Table of Contents

1. [Current Implementation Analysis](#current-implementation-analysis)
2. [Technical Issues](#technical-issues)
3. [Performance Implications](#performance-implications)
4. [Security Concerns](#security-concerns)
5. [Recommended Solutions](#recommended-solutions)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Testing Strategy](#testing-strategy)
8. [Migration Plan](#migration-plan)

---

## Current Implementation Analysis

### Code Location
**File:** `src/api/user/features/auth/auth.router.ts`

### Current Configuration
```typescript
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } //50mb
});
```

### Usage Points
1. **User Registration** - `POST /auth/register`
   - Accepts `profileImage` as multipart form data
   - Stores image reference in MongoDB User model

2. **Profile Update** - `PUT /auth/update`
   - Allows authenticated users to update profile image
   - Same memory storage constraints apply

### Data Flow
```
Client Upload (50MB max)
    ↓
Multer Memory Storage (RAM)
    ↓
Process in auth.controller.ts
    ↓
Store reference in MongoDB
    ↓
Memory Released
```

---

## Technical Issues

### 1. Memory Consumption Analysis

#### Single Upload Scenario
```
File Size: 50MB
Memory Required: ~50MB RAM per upload
Processing Time: 2-5 seconds (varies with connection speed)
Total Memory Impact: 50MB * processing_time
```

#### Concurrent Upload Scenario
```
Concurrent Users: 20
Average Upload Size: 30MB
Total Memory Required: 600MB RAM
```

With the current setup:
- Each upload occupies memory until fully processed
- No memory pooling or management
- Risk of memory exhaustion increases linearly with concurrent users

#### Memory Leak Potential
```javascript
// Potential memory leak scenario
app.post('/upload', upload.single('file'), (req, res) => {
    // If error occurs before response sent:
    // - req.file buffer remains in memory
    // - No automatic cleanup
    // - Memory leak accumulates
});
```

### 2. Database Storage Pattern

**Current Pattern:**
```typescript
// From auth.service.ts
profileImage?: string  // Stored as string in MongoDB
```

**Questions to Address:**
- How is the image data being serialized? (Base64? URL?)
- Is the full image stored in MongoDB or just a reference?
- What is the actual size impact on database storage?

**If Base64 Encoded:**
```
Original Image: 50MB
Base64 Encoded: ~67MB (33% size increase)
MongoDB Document Limit: 16MB (⚠️ PROBLEM!)
```

**Note:** MongoDB has a 16MB document size limit. Storing large images as Base64 in documents will fail.

### 3. Scalability Bottlenecks

#### Horizontal Scaling Issues
```
Load Balancer
    ├─ Server 1 (Memory: in-use upload data lost on crash)
    ├─ Server 2 (No shared memory between instances)
    └─ Server 3 (Each handles memory independently)
```

Problems:
- Session affinity required for multi-part uploads
- No shared state between instances
- Memory pressure unevenly distributed

#### Vertical Scaling Limitations
```
Server Memory: 4GB
Available for Uploads: ~1GB (after OS, Node.js, other processes)
Max Concurrent 50MB Uploads: ~20 users
```

This is not production-ready for a user-facing application.

---

## Performance Implications

### Response Time Impact

#### Current Performance (Estimated)
```
Upload Size | Memory Load Time | Processing | Total Time
---------------------------------------------------------
1MB         | 100ms           | 50ms       | 150ms
10MB        | 1s              | 200ms      | 1.2s
50MB        | 5s              | 500ms      | 5.5s
```

#### Memory Pressure Impact
```
Available Memory | Upload Time Degradation
------------------------------------------------
> 2GB free      | Normal (baseline)
1-2GB free      | +20% slower (GC pressure)
< 1GB free      | +50% slower (heavy GC)
< 500MB free    | +100% slower (constant GC)
< 100MB free    | Crashes / OOM errors
```

### Garbage Collection Impact

Large memory allocations trigger more frequent garbage collection:
```javascript
// Memory allocation pattern
const upload50MB = req.file.buffer; // 50MB allocation
// Triggers major GC cycle
// Pauses Node.js event loop
// All requests affected, not just uploads
```

Impact:
- Event loop blocking
- Increased latency for all endpoints
- Poor user experience across the application

---

## Security Concerns

### 1. Denial of Service (DoS) Vulnerability

**Attack Vector:**
```bash
# Attacker script
for i in {1..100}; do
  curl -X POST http://api.feelgpt.com/auth/register \
    -F "email=user$i@example.com" \
    -F "password=test123" \
    -F "profileImage=@50mb_image.jpg" &
done
```

**Result:** 5GB of memory consumed instantly, server crashes

**Mitigation Needed:**
- Rate limiting per IP
- Rate limiting per user
- Memory usage monitoring
- Automatic request rejection when memory pressure high

### 2. Memory Exhaustion Attack

Even without malicious intent:
- Legitimate traffic spike during marketing campaign
- Multiple users uploading large images simultaneously
- Server runs out of memory
- Application crashes
- Database connections lost
- User data potentially corrupted

### 3. File Type Security

**Current State:** No file type validation visible

**Risks:**
- Malicious files disguised as images
- Executable files uploaded
- SVG files with embedded scripts
- Exploit attempts via image parsing libraries

**Required Validations:**
```typescript
// Recommended validation
fileFilter: (req, file, cb) => {
    // Check MIME type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    
    // Check file extension
    const allowedExts = /\.(jpg|jpeg|png|webp)$/i;
    
    // Verify magic bytes (file signature)
    // This requires reading the file buffer
    
    if (allowedMimes.includes(file.mimetype) && 
        allowedExts.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
}
```

---

## Recommended Solutions

### Solution 1: Disk-Based Storage (Quick Win)

**Pros:**
- Easy to implement
- No external dependencies
- Immediate memory savings
- Works with existing infrastructure

**Cons:**
- Requires disk space management
- Cleanup jobs needed for temporary files
- Not ideal for multi-server deployments

**Implementation:**
```typescript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../uploads/temp'));
    },
    filename: (req, file, cb) => {
        const uniqueId = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Validate extension against allowlist
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
        if (!allowedExts.includes(ext)) {
            cb(new Error('Invalid file extension'));
            return;
        }
        
        cb(null, `profile-${uniqueId}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
        }
    }
});
```

**Required Infrastructure:**
```bash
# Create upload directories
mkdir -p uploads/temp
mkdir -p uploads/profiles

# Set proper permissions
chmod 755 uploads/
chmod 755 uploads/temp
chmod 755 uploads/profiles
```

**Cleanup Job:**
```typescript
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';

// Run every hour
cron.schedule('0 * * * *', async () => {
    const tempDir = path.join(__dirname, '../../../uploads/temp');
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
            await fs.unlink(filePath);
            console.log(`Cleaned up temporary file: ${file}`);
        }
    }
});
```

### Solution 2: Cloud Storage (Production Ready)

**Recommended Provider: AWS S3**

**Reasons:**
- Industry standard
- Excellent SDK support
- Built-in CDN (CloudFront)
- Competitive pricing
- Reliable and scalable

**Cost Estimation:**
```
Assumptions:
- 10,000 active users
- Average profile image: 500KB (after optimization)
- 20% users change profile monthly

Storage Cost:
10,000 users × 500KB = 5GB
AWS S3 Standard: Check current pricing
Monthly Storage: Very low cost (typically under $1)

Transfer Cost:
2,000 uploads/month × 500KB = 1GB upload
Uploads are free
Downloads via CloudFront: negligible for profile images

Estimated Total Monthly Cost: Less than $1

Note: For exact pricing, use the AWS Pricing Calculator:
https://calculator.aws
or check current S3 pricing at:
https://aws.amazon.com/s3/pricing/
```

**Implementation:**
```typescript
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'path';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET_NAME!,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const ext = path.extname(file.originalname);
            cb(null, `profiles/${uniqueId}${ext}`);
        }
    }),
    limits: { 
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
```

**Environment Variables:**
```bash
# .env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=feelgpt-profile-images
```

**S3 Bucket Configuration:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::feelgpt-profile-images/profiles/*"
    }
  ]
}
```

### Solution 3: Image Processing Pipeline

**Add Image Optimization:**
```typescript
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// Process image from disk with streaming to avoid memory issues
const processAndSaveImage = async (
    inputPath: string, 
    outputDir: string
): Promise<string> => {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const outputPath = path.join(outputDir, `${uniqueId}.webp`);
    
    // Use streaming to avoid loading entire image into memory
    await sharp(inputPath)
        .resize(800, 800, { 
            fit: 'inside',
            withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(outputPath); // Stream directly to file
    
    return outputPath;
};

// In upload handler (with disk storage)
authRouter.post("/register", upload.single("profileImage"), async (req, res) => {
    if (req.file) {
        try {
            // Process from disk and stream to output (no large buffers)
            const optimizedPath = await processAndSaveImage(
                req.file.path,
                'uploads/profiles'
            );
            
            // Upload optimizedPath to S3 or use as final location
            // Clean up temporary file
            await fs.unlink(req.file.path);
        } catch (error) {
            console.error('Image processing failed:', error);
            // Clean up on error
            if (req.file.path) {
                await fs.unlink(req.file.path).catch(() => {});
            }
            throw error;
        }
    }
});
```

**Benefits:**
- Smaller file sizes (50-70% reduction)
- Faster load times
- Reduced bandwidth costs
- Better user experience

---

## Implementation Roadmap

### Phase 1: Immediate (Week 1)
- [ ] Switch to disk-based storage
- [ ] Reduce file size limit to 5MB
- [ ] Add file type validation
- [ ] Implement temporary file cleanup
- [ ] Add error handling and logging

### Phase 2: Short-term (Week 2-3)
- [ ] Set up AWS S3 bucket
- [ ] Implement S3 upload integration
- [ ] Add image optimization pipeline
- [ ] Update User model if needed
- [ ] Test with existing user data

### Phase 3: Medium-term (Week 4-6)
- [ ] Implement rate limiting
- [ ] Add monitoring and alerting
- [ ] Set up CDN for image delivery
- [ ] Create migration script for existing images
- [ ] Performance testing

### Phase 4: Long-term (Month 2-3)
- [ ] Implement image variants (thumbnails, different sizes)
- [ ] Add client-side image compression
- [ ] Implement lazy loading
- [ ] Advanced caching strategies
- [ ] Security audit

---

## Testing Strategy

### Unit Tests
```typescript
describe('Profile Image Upload', () => {
    it('should reject files larger than 5MB', async () => {
        const largeFile = createMockFile(6 * 1024 * 1024);
        const response = await request(app)
            .post('/auth/register')
            .attach('profileImage', largeFile);
        expect(response.status).toBe(400);
    });

    it('should accept valid image types', async () => {
        const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        for (const type of imageTypes) {
            const file = createMockFile(1024 * 1024, type);
            const response = await request(app)
                .post('/auth/register')
                .attach('profileImage', file);
            expect(response.status).not.toBe(400);
        }
    });

    it('should reject invalid file types', async () => {
        const file = createMockFile(1024 * 1024, 'application/pdf');
        const response = await request(app)
            .post('/auth/register')
            .attach('profileImage', file);
        expect(response.status).toBe(400);
    });
});
```

### Integration Tests
```typescript
describe('Image Storage Integration', () => {
    it('should successfully upload to S3', async () => {
        const file = createValidImageFile();
        const response = await request(app)
            .post('/auth/register')
            .attach('profileImage', file);
        
        expect(response.status).toBe(201);
        expect(response.body.user.profileImage).toMatch(/^https:\/\/.*\.s3\.amazonaws\.com\/.*/);
    });

    it('should delete old image when updating', async () => {
        // Test that old S3 object is deleted when user updates profile image
    });
});
```

### Performance Tests
```typescript
describe('Upload Performance', () => {
    it('should handle concurrent uploads', async () => {
        const uploads = Array(20).fill(null).map(() =>
            request(app)
                .post('/auth/register')
                .attach('profileImage', createValidImageFile())
        );
        
        const responses = await Promise.all(uploads);
        const allSuccessful = responses.every(r => r.status === 201);
        expect(allSuccessful).toBe(true);
    });
});
```

### Load Tests
```bash
# Using Artillery or K6
artillery quick --count 100 --num 10 http://localhost:5001/auth/register
```

---

## Migration Plan

### For Existing Images in MongoDB

#### Step 1: Audit Current Data
```typescript
// Script to check current profile images
const users = await prisma.user.findMany({
    where: {
        profileImage: { not: null }
    },
    select: {
        id: true,
        profileImage: true
    }
});

console.log(`Total users with profile images: ${users.length}`);

// Analyze format
const formats = users.reduce((acc, user) => {
    if (user.profileImage?.startsWith('http')) {
        acc.url++;
    } else if (user.profileImage?.startsWith('data:')) {
        acc.base64++;
    } else {
        acc.other++;
    }
    return acc;
}, { url: 0, base64: 0, other: 0 });

console.log('Image formats:', formats);
```

#### Step 2: Migration Script (Memory-Efficient)
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';

const BATCH_SIZE = 10; // Process 10 users at a time to avoid memory issues

async function migrateImagesToS3() {
    const users = await prisma.user.findMany({
        where: { profileImage: { not: null } }
    });

    console.log(`Migrating ${users.length} profile images...`);

    // Process in batches to avoid memory pressure
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (user) => {
            const tempFile = path.join('/tmp', `migration-${user.id}.tmp`);
            
            try {
                // Download/decode to temporary file first
                if (user.profileImage.startsWith('http')) {
                    // Stream download to disk
                    const response = await axios.get(user.profileImage, {
                        responseType: 'stream'
                    });
                    await fs.writeFile(tempFile, response.data);
                } else if (user.profileImage.startsWith('data:')) {
                    // Decode base64 to disk
                    const base64Data = user.profileImage.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    await fs.writeFile(tempFile, buffer);
                } else {
                    console.warn(`Unknown format for user ${user.id}`);
                    return;
                }

                // Optimize using streams (no large buffers)
                const key = `profiles/${user.id}.webp`;
                const optimizedFile = path.join('/tmp', `optimized-${user.id}.webp`);
                
                await sharp(tempFile)
                    .resize(800, 800, { fit: 'inside' })
                    .webp({ quality: 85 })
                    .toFile(optimizedFile); // Stream to file instead of buffer

                // Upload to S3 using streaming (avoid loading entire file into memory)
                const fileStream = createReadStream(optimizedFile);
                await s3Client.send(new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: key,
                    Body: fileStream,
                    ContentType: 'image/webp',
                    ACL: 'public-read'
                }));

                // Update user record
                const newUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
                await prisma.user.update({
                    where: { id: user.id },
                    data: { profileImage: newUrl }
                });

                console.log(`✓ Migrated image for user ${user.id}`);
            } catch (error) {
                console.error(`✗ Failed to migrate image for user ${user.id}:`, error);
            } finally {
                // Clean up temporary files
                await fs.unlink(tempFile).catch(() => {});
                await fs.unlink(path.join('/tmp', `optimized-${user.id}.webp`)).catch(() => {});
            }
        }));

        console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed`);
    }
    
    console.log('Migration completed!');
}
```

#### Step 3: Verification
```typescript
async function verifyMigration() {
    const users = await prisma.user.findMany({
        where: { profileImage: { not: null } }
    });

    let successful = 0;
    let failed = 0;

    for (const user of users) {
        try {
            const response = await axios.head(user.profileImage);
            if (response.status === 200) {
                successful++;
            } else {
                failed++;
                console.error(`Invalid URL for user ${user.id}: ${user.profileImage}`);
            }
        } catch (error) {
            failed++;
            console.error(`Failed to verify user ${user.id}:`, error);
        }
    }

    console.log(`Migration verification: ${successful} successful, ${failed} failed`);
}
```

---

## Monitoring and Alerts

### Metrics to Track

1. **Memory Usage**
   ```typescript
   import { memoryUsage } from 'process';
   
   setInterval(() => {
       const usage = memoryUsage();
       console.log({
           rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
           heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
           heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
           external: `${Math.round(usage.external / 1024 / 1024)}MB`
       });
   }, 60000); // Every minute
   ```

2. **Upload Metrics**
   - Upload success rate
   - Upload duration
   - File sizes
   - Failure reasons

3. **Storage Metrics**
   - Total storage used
   - Growth rate
   - Cost tracking

### Alert Conditions

```typescript
const alerts = {
    heapUsageThreshold: 0.9, // 90% of heap
    uploadFailureRate: 0.05, // 5% failure rate
    storageGrowthRate: 1.5   // 50% increase in 24 hours
};
```

---

## Conclusion

The current in-memory storage approach for profile pictures is not suitable for production use. It poses significant risks to application stability, user experience, and security. 

**Immediate Action Required:**
1. Switch to disk-based storage (can be done in < 1 day)
2. Reduce file size limit to 5MB
3. Add file type validation

**Recommended Long-term Solution:**
- Migrate to AWS S3 or similar cloud storage
- Implement image optimization pipeline
- Add comprehensive monitoring

**Estimated Impact:**
- 95% reduction in memory usage
- Improved application stability
- Better user experience
- Enhanced security posture
- Reduced infrastructure costs

This migration should be prioritized as a high-severity issue and completed within 1-2 weeks (see Phase 1 in Implementation Roadmap section above, which targets Week 1 for immediate fixes).
