import { useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import useTranslation from "next-translate/useTranslation";
import { Box, Button, Dialog, Grid, Input, Typography } from "@mui/material";
import "cropperjs/dist/cropper.css";

interface PropsType {
  onCrop: (image: string) => void;
  aspectRatio: number;
  children: React.ReactNode;
}

const ImageCropper = ({ children, aspectRatio, onCrop }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [image, setImage] = useState<null | string>(null);
  const [open, setopen] = useState<boolean>(false);

  const { t } = useTranslation("common");

  const onClose = () => {
    if (inputRef.current) inputRef.current.value = '';
    setopen(false);
  };

  const handleChildrenClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (files?.length === 0 || !files) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
    setopen(true);

    if (inputRef.current) inputRef.current.value = '';
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      onCrop(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      setImage(null);
    }
  };

  return (
    <>
      <Input
        type="file"
        inputRef={inputRef}
        style={{display: "none"}}
        onChange={handleFileChange}
      />
      <Button onClick={handleChildrenClick} sx={{cursor: 'pointer', p:0, minWidth: 'auto'}}>{children}</Button>
      {image && (
        <Dialog
          maxWidth="xs"
          onClose={onClose}
          open={!!open}
          PaperProps={{ sx: { overflow: "hidden", alignItems: 'center'} }}
        >
          <Grid container>
              <Typography
                align="center"
                gutterBottom
                fontSize={"25px"}
                color={"primary"}
                fontWeight={"bold"}
                mt={1}
                mx={'auto'}
              >
                  {t("ProfileImageCrop")}
              </Typography>
            <Grid item xs={12}>
              <Cropper
                className="rounded hidden-line"
                ref={cropperRef}
                aspectRatio={aspectRatio}
                src={image}
                width={300}
                viewMode={1}
                background={false}
                responsive
                autoCropArea={0.9}
                checkOrientation={false}
              />
            </Grid>

            <Grid item xs={12} my={1}>
              <Box sx={{ display: 'flex', justifyContent:'flex-end' }}>
                <Button
                  onClick={() => {
                    setImage(null);
                    onClose;
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  sx={{ ml:2, mr: 3 }}
                  onClick={getCropData}
                  variant="contained"
                >
                  {t("Ok")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </>
  );
};

export default ImageCropper;
