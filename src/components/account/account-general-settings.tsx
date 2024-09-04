import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import ImageCropper from 'components/common/image-cropper';
import { UserCircle as UserCircleIcon } from 'components/icons/user-circle';
import { useAuth } from 'hooks/use-auth';
import useTransition from 'next-translate/useTranslation';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { dataURItoFile } from 'utils/file-util';
import useImageCompress from 'utils/use-image-compress';

interface PropsType {
  handleCheckMeAlert: (type : 'DeleteAccount' | 'ChangePassword') => void;
}

export const AccountGeneralSettings = ({handleCheckMeAlert} : PropsType) => {

  const { user, modifyUserAvatar, changeMyName } = useAuth();
  const {t} = useTransition("mypage");

  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const { isLoading: isCompressLoading, compressImage } = useImageCompress();
  const [name, setName] = useState<string>(user?.userNm ? user?.userNm : '');

  const handleUploadImage = (image: string) => setUploadImage(image);

  const deleteAccount = () => handleCheckMeAlert('DeleteAccount');

  const handleCompressImage = async () => {
    if (!uploadImage) return;

    const imageFile = dataURItoFile(uploadImage);

    const compressedImage = await compressImage(imageFile);

    // 이미지 서버 저장 로직
    if (!compressedImage) return;
    user && toast.promise(
      modifyUserAvatar(compressedImage,user),
       {
         loading: t("Registering"),
         success: t('SuccessUpdate'),
         error: t('SuccessFailed'),
       }
     );

    setUploadImage(null);
  };

  const changeName = async (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const changeNameClick = async () => {
    user && await changeMyName(user,name).then(()=>{
      toast.success(t('SuccessUpdate'));
    }).catch (()=>{
      toast.error(t('SuccessFailed'));
    });;
  }

  useEffect(() => {
    if (uploadImage) {
      handleCompressImage();
    }
  }, [uploadImage]);

  return (
    <Box
      sx={{ mt: 4 }}
    >
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                {t("BasicDetails")}
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              > 
                <Avatar
                src={user?.avatar}
                sx={{
                  height: 64,
                  mr: 2,
                  width: 64
                }}
              >
                <UserCircleIcon fontSize="small" />
              </Avatar>
                <ImageCropper aspectRatio={1} onCrop={handleUploadImage}>
                  <Button>
                  {t("ProfileChange")}
                  </Button>
                </ImageCropper>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  mt: 3,
                  alignItems: 'center'
                }}
              >
                <TextField
                  defaultValue={user?.loginId}
                  disabled
                  label={t("EmailAddress")}
                  required
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderStyle: 'dashed'
                    }
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  mt: 3,
                  alignItems: 'center'
                }}
              >
                <TextField
                  defaultValue={name}
                  label={t("FullName")}
                  onChange={changeName}
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3
                  }}
                />
                <Button onClick={changeNameClick}>
                {t("Save")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
              {t("DeleteAccount")}
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Typography
                sx={{ mb: 3 }}
                variant="subtitle1"
              >
                {t("DeleteAccountInfo")}
              </Typography>
              <Button
                color="error"
                variant="outlined"
                onClick={deleteAccount}
              >
               {t("DeleteAccount")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
