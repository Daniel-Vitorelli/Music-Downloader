interface typeMusicCard {
  filename?: string,
  percent: number,
  status: 'queued' | 'downloading' | 'done' | 'error';
  downloadUrl?: string;
  jobId: string;
}

export default typeMusicCard;