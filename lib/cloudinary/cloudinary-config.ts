// Client-side Cloudinary configuration
// This avoids using the Node.js SDK which requires 'fs' module

// For client-side usage, we only need the cloud name
export const cloudConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

// Helper to construct Cloudinary URLs
export function getCloudinaryUrl(publicId: string, options: any = {}) {
  const { cloudName } = cloudConfig;
  const transformations = options.transformations || '';
  const resourceType = options.resourceType || 'video'; // Cloudinary uses 'video' for audio
  
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}${publicId}`;
}
