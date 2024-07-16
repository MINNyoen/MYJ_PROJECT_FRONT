import { File } from "types/file";

export interface Board {
  id: string;
  title: string;
  content: string;
  views: number;
  writer: string;
  fileExist: boolean;
  regId: string;
  regDt: number;
  updDt: number;
  files: File[];
}

