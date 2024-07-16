import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { useAuth } from 'hooks/use-auth';
import { useMounted } from 'hooks/use-mounted';
import useTransition from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Login } from 'types/user';
import * as Yup from 'yup';

export const JWTLogin: FC = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth();
  const {t, lang} = useTransition('login');
  const {t:c} = useTransition("common");

  const { handleSubmit, register, formState: {errors}, clearErrors, control, getValues } = useForm({
    defaultValues: {
      loginId: '',
      password: '',
      remember: false,
    },
    resolver: yupResolver(Yup.object({
      loginId: Yup
        .string()
        .email(t('valEmail-t'))
        .max(50, c("valmax", {max: '50'}))
        .required(t('valEmail-r')),
      password: Yup
        .string()
        .max(30, c("valmax", {max: '30'}))
        .required(t('valPassword-r')),
      remember: Yup
        .boolean()
        .required()
    })),
  })

  useEffect(()=>{
    clearErrors();
  },[lang]);

  const onSubmit = async (values : any) => {
      try {
        const loginUser : Login = {
          loginId : values.loginId,
          pwd : values.password,
          remember: values.remember
        }
        await login(loginUser);

        if (isMounted()) {
            const returnUrl = (router.query.returnUrl as string | undefined) || '/';
            router.push(returnUrl).catch(console.error);
        };
      } catch (err: any) {
        console.error(err);
      }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        autoFocus
        fullWidth
        label={t('E-Mail')}
        margin="normal"
        {...register('loginId')}
        error={!!errors.loginId}
        helperText={errors.loginId?.message}
      />
      <TextField
        fullWidth
        label={t('PWD')}
        margin="normal"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Controller
        name="remember"
        control={control}
        render={({ field : {value, onChange}, ...props}) => {
          return (
            <FormControlLabel
                control={
                    <Switch
                      checked={value}
                      {...register("remember")}
                      onChange={onChange}
                    />
                    }
                    label={t("Remember")}
                    labelPlacement={"end"}
                    />
                  )
               }}
          />      
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {t('LogIn')}
        </Button>
      </Box>
    </form>
  );
};
