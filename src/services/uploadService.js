// src/services/uploadService.js
import { Platform } from 'react-native';
import { uploadService } from './api';

class UploadService {
  async uploadFile(file, type = 'pdf', onProgress = null) {
    try {
      // Create FormData
      const formData = new FormData();
      
      // Append file with proper structure
      formData.append('file', {
        uri: file.uri,
        type: file.type || this.getMimeType(type),
        name: file.name || `file_${Date.now()}.${this.getFileExtension(type)}`
      });

      // Determine endpoint based on file type
      const endpoint = type === 'pdf' ? '/upload/pdf' : '/upload/video';
      
      // Upload file with progress tracking
      const response = await uploadService.uploadFile(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        }
      });

      return {
        success: true,
        data: response.data,
        url: response.data.url
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Upload failed'
      };
    }
  }

  async uploadImage(file, onProgress = null) {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `image_${Date.now()}.jpg`
      });

      // Using the same upload endpoint but for images
      const response = await uploadService.uploadFile('/upload/pdf', formData, {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        }
      });

      return {
        success: true,
        data: response.data,
        url: response.data.url
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Image upload failed'
      };
    }
  }

  getMimeType(type) {
    const mimeTypes = {
      pdf: 'application/pdf',
      video: 'video/mp4',
      image: 'image/jpeg'
    };
    return mimeTypes[type] || 'application/octet-stream';
  }

  getFileExtension(type) {
    const extensions = {
      pdf: 'pdf',
      video: 'mp4',
      image: 'jpg'
    };
    return extensions[type] || 'bin';
  }

  validateFile(file, type) {
    const maxSizes = {
      pdf: 50 * 1024 * 1024, // 50MB
      video: 500 * 1024 * 1024, // 500MB
      image: 10 * 1024 * 1024 // 10MB
    };

    if (file.size > maxSizes[type]) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${this.formatFileSize(maxSizes[type])}`
      };
    }

    return { valid: true };
  }

  // Add image-specific validation
  validateImage(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Image too large. Maximum size: ${this.formatFileSize(maxSize)}`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are supported'
      };
    }

    return { valid: true };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new UploadService();