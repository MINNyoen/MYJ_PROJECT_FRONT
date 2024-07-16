import { FC, useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Divider,
  ButtonBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from 'hooks/use-auth';
import { UserCircle as UserCircleIcon } from 'components/icons/user-circle';
import path from 'components/path.json'
import useTranslation from 'next-translate/useTranslation';
import ImageCropper from 'components/common/image-cropper';
import { dataURItoFile } from 'utils/file-util';
import useImageCompress from 'utils/use-image-compress';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { logout, user, modifyUserAvatar } = useAuth();

  const {t} = useTranslation('common');

  const handleLogout = async (): Promise<void> => {
    try {
      onClose?.();
      await logout();
      router.push('/authentication/login').catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };


  //==========image
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const { isLoading: isCompressLoading, compressImage } = useImageCompress();

  const handleUploadImage = (image: string) => setUploadImage(image);

  const handleCompressImage = async () => {
    if (!uploadImage) return;

    const imageFile = dataURItoFile(uploadImage);

    const compressedImage = await compressImage(imageFile);

    // 이미지 서버 저장 로직
    if (!compressedImage) return;
    //const imageUrl = URL.createObjectURL(compressedImage);
    modifyUserAvatar(compressedImage);
  };

  useEffect(() => {
    if (uploadImage) {
      handleCompressImage();
    }
  }, [uploadImage]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 150 } }}
      transitionDuration={0} 
      {...other}
    >
      {/* <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <ImageCropper aspectRatio={1} onCrop={handleUploadImage}>
        <Avatar
          src={user?.avatar}
          sx={{
            height: 40,
            width: 40
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <SettingsIcon viewBox={'2 0 25 25'} sx={{position: 'absolute', top: 25, left: 25, color: 'background.nav'}}/>
        </ImageCropper>
        <Box
          sx={{
            ml: 2
          }}
        >
          <Typography variant="body1" letterSpacing={3}>
            {user?.userNm}
          </Typography>
        </Box>
      </Box>
      <Divider /> */}
      <Box sx={{ my: 1 }}>
        <NextLink
          href={path.pages.minyeonjin.mypage}
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  {t('MyPage')}
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                {t('Logout')}
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const { user } = useAuth();

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          width: '100%'
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40,
          }}
          src={user?.avatar}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" letterSpacing={1} pl={1}>
            {user?.userNm}
        </Typography>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};
