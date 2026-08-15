export interface VideoClip {
  id: string;
  fileName: string;
  filePath: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  fileSizeBytes: number;
  createdAt: number;
  serverOrDmName?: string;
}
