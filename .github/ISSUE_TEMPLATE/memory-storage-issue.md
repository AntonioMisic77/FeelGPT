---
name: Memory Storage Issue for Profile Pictures
about: Address memory concerns for storing profile pictures in backend
title: "[BACKEND] Memory Management Issue for Profile Picture Storage"
labels: backend, enhancement, performance, memory
assignees: ''
---

## Problem Description

The current backend implementation uses in-memory storage (`multer.memoryStorage()`) for handling profile picture uploads. This approach has several critical limitations and potential issues that need to be addressed.

## Current Implementation

**Location:** `backend/src/api/user/features/auth/auth.router.ts`

```typescript
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } //50mb
});
```

**Current Behavior:**
- Profile images are uploaded using multer with in-memory storage
- Maximum file size limit: 50MB per upload
- Images are stored as strings in MongoDB (likely base64 encoded or URLs)
- No disk-based persistence during upload processing

## Issues and Concerns

### 1. **Memory Consumption**
- **Risk Level:** HIGH
- Each uploaded file (up to 50MB) is loaded entirely into RAM
- Multiple concurrent uploads can quickly exhaust server memory
- Example: 10 concurrent 50MB uploads = 500MB of RAM consumed instantly
- Memory is not released until the upload completes and the request is processed

### 2. **Scalability Problems**
- **Risk Level:** HIGH
- Not suitable for production environments with many concurrent users
- Can lead to server crashes under load
- No horizontal scaling support (memory-based uploads don't work well with load balancers)

### 3. **Resource Inefficiency**
- **Risk Level:** MEDIUM
- Memory is more expensive than disk storage
- No ability to stream large files efficiently
- Temporary storage in RAM is wasteful when disk alternatives exist

### 4. **Reliability Concerns**
- **Risk Level:** MEDIUM
- Server restart during upload causes data loss
- No recovery mechanism for interrupted uploads
- Out-of-memory errors can crash the entire application

### 5. **Security Implications**
- **Risk Level:** MEDIUM
- Potential for Denial-of-Service (DoS) attacks through multiple large file uploads
- Memory exhaustion can affect all application features, not just file uploads
- No rate limiting mechanism for memory consumption

## Impact Assessment

**Affected Components:**
- User registration endpoint (`/auth/register`)
- User profile update endpoint (`/auth/update`)
- All users uploading or updating profile pictures

**Potential Consequences:**
- Application crashes during high traffic
- Poor user experience (slow uploads, timeouts)
- Increased infrastructure costs
- Security vulnerabilities

## Recommended Solutions

### Option 1: Disk-Based Storage (Recommended for Quick Fix)
```typescript
import crypto from 'crypto';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/temp/')
        },
        filename: (req, file, cb) => {
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const ext = path.extname(file.originalname);
            cb(null, `profile-${uniqueId}${ext}`)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Reduce to 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
```

**Benefits:**
- Immediate reduction in memory usage
- Better handling of concurrent uploads
- Easier to implement cleanup routines

### Option 2: Cloud Storage Service (Recommended for Production)
Integrate with cloud storage providers:
- **AWS S3**: Industry standard, highly scalable
- **Google Cloud Storage**: Good integration with other GCP services
- **Azure Blob Storage**: Already using Azure for AI services
- **Cloudinary**: Specialized for images with built-in optimization

**Example with AWS S3 (using SDK v3):**
```typescript
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

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
        bucket: 'feelgpt-profile-images',
        acl: 'public-read',
        key: (req, file, cb) => {
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const ext = path.extname(file.originalname);
            cb(null, `profiles/${uniqueId}${ext}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});
```

**Benefits:**
- Unlimited scalability
- Built-in CDN capabilities
- Automatic backups and redundancy
- No server storage management needed
- Better performance globally

### Option 3: Hybrid Approach
- Use disk storage for temporary processing
- Asynchronously upload to cloud storage
- Delete local copy after cloud upload succeeds

## Additional Recommendations

1. **Reduce File Size Limit**
   - Current 50MB limit is excessive for profile pictures
   - Recommended: 2-5MB maximum
   - Implement client-side image compression

2. **Implement Image Processing**
   - Use Sharp or Jimp for server-side image optimization
   - Generate thumbnails and multiple sizes
   - Convert to WebP for better compression

3. **Add Validation**
   - Validate file types (JPEG, PNG, WebP, GIF only)
   - Check image dimensions
   - Scan for malicious content

4. **Implement Rate Limiting**
   - Limit uploads per user per time period
   - Prevent abuse and DoS attacks

5. **Add Monitoring**
   - Track memory usage metrics
   - Alert on high memory consumption
   - Log upload failures and errors

## Implementation Priority

- **Priority 1 (Critical):** Switch from memory to disk storage
- **Priority 2 (High):** Reduce file size limit to 5MB
- **Priority 3 (High):** Add file type validation
- **Priority 4 (Medium):** Implement cloud storage migration
- **Priority 5 (Medium):** Add image optimization pipeline
- **Priority 6 (Low):** Implement advanced monitoring

## References

- Multer Documentation: https://github.com/expressjs/multer
- AWS S3 Best Practices: https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html
- Image Optimization Guide: https://web.dev/fast/#optimize-your-images

## Acceptance Criteria

- [ ] Profile pictures no longer stored in memory during upload
- [ ] File size limit reduced to reasonable amount (≤5MB)
- [ ] Proper file type validation implemented
- [ ] Memory usage monitoring in place
- [ ] Documentation updated with new upload process
- [ ] Tests added for upload functionality
- [ ] Migration plan for existing images (if applicable)

## Related Issues

- Performance optimization
- Infrastructure scalability
- Security hardening
