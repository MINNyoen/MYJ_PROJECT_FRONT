import { File } from "types/file";

export interface Board {
  seq: string;
  title: string;
  content: string;
  views: number;
  writer: string;
  fileExist: boolean;
  mine: boolean;
  regId: string;
  regDt: number;
  updDt: number;
  fileList: File[];
}

