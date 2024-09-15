import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Box, Button, Checkbox, FormHelperText, Grid, Link, TextField, Typography } from '@mui/material';
import { useAuth } from 'hooks/use-auth';
import { useMounted } from 'hooks/use-mounted';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EmailExp, PasswordExp } from 'utils/regExp';
import useTransition from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import toast from 'react-hot-toast';
import { Mail } from '@mui/icons-material';
import { User } from 'types/user';
import { commonApi } from 'api/common-api';

export const JWTRegister: FC = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const [Ctf_num, setCtf_num] = useState<string>('');
  const { register : registerUseAuth } = useAuth();
  const {t, lang} = useTransition('register');
  const {t:c} = useTransition("common");

  useEffect(()=>{
    clearErrors();
  },[lang])

  const {control, clearErrors, handleSubmit, formState: {errors}, setError, register, getValues, setValue} = useForm({
    defaultValues: {
      loginId: '',
      emailChk: false,
      name: '',
      password: '',
      passwordChk: '',
      birth: new Date(),
      Ctf_num: '',
      policy: false,
    },
    resolver: yupResolver(Yup.object({
      loginId: Yup
        .string()
        .email(t('valE-Mail-t'))
        .max(50, c("valMax", {max: '50'}))
        .required(t('valE-Mail-r')),
      name: Yup
        .string()
        .max(10, c("valMax", {max: '10'}))
        .required(t('valName-r')),
      password: Yup
        .string()
        .required(t('valPassword-r'))
        .matches(PasswordExp, {
        message: t('valPassword-t'),
        excludeEmptyString: false,
         }),
      passwordChk: Yup
         .string()
         .required(t('valPasswordChk-r'))
         .oneOf([Yup.ref('password'), null], t('valPasswordChk-c'))
         .matches(PasswordExp, {
         message: t('valPassword-t'),
         excludeEmptyString: false,
          }),
      birth: Yup.date().required(t('valBirth-r')),
      policy: Yup
        .boolean()
        .oneOf([true], t('valPolicy-r')),
      emailChk: Yup
      .boolean()
      .oneOf([true], t('valE-MailChk-r')),
    }))
  });

  const onSubmit = async (values : any) => {
    try {
      const user: User = {
        loginId : values.loginId,
        pwd : values.password,
        userNm : values.name,
        birthDt : values.birth,
        avatar : ''
      };

      await registerUseAuth(user);

      if (isMounted()) {
        const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
        router.push(returnUrl).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const emailChk = async () => {
    clearErrors('loginId');
    setValue('emailChk', false);
    if(EmailExp.test(getValues('loginId'))){
      toast(t('emailCodeSend'), {icon : <Mail/>});
      await commonApi("post","/user/checkMail",{mail: getValues("loginId")},undefined,{'Content-Type': 'application/json'})
      .then((response)=>{
        setCtf_num(response);
        clearErrors('Ctf_num');
      })
    }
    else {
      setError('loginId', {message:t('valE-Mail-r')});

    }
  }

  const chkEmailCode = (value?: string) => {
    if(value === Ctf_num){
      clearErrors('Ctf_num');
      clearErrors('emailChk');
      setValue('emailChk', true);
    }
    else{
      setError('Ctf_num', {message:t('valEmailCode-r')});
      setValue('emailChk', false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        fullWidth
        label={t('E-Mail')}
        margin="normal"
        {...register('loginId')}
        onKeyUp={()=>{
          clearErrors('Ctf_num');
          clearErrors('emailChk');
          setValue('emailChk', false);
        }}
        error={!!errors.loginId}
        helperText={errors.loginId?.message}
      />
      <Button
          fullWidth
          size="large"
          variant="outlined"
          onClick={emailChk}
        >
          {t('E-MailCrt')}
      </Button>
      {Ctf_num && (
      <Grid container>
        <Grid item xs={12} sm={6}>
      <TextField
      fullWidth
      sx={getValues('emailChk') ? {
        "& .MuiInputLabel-root": {color: 'green !important'},
        "& .MuiOutlinedInput-root": {
          "& > fieldset": { borderColor: "green !important" }}
      } : {}}
      label={t('emailChk')}
      margin="normal"
      {...register('Ctf_num')}
      error={!!errors.Ctf_num}
      helperText={errors.Ctf_num?.message}
      />
      {getValues('emailChk') && (
        <FormHelperText sx={{color: 'green', ml: 2, mt: -1}}>
            {t('emailChkOk')}
        </FormHelperText>
      )}
      </Grid>
      <Grid item xs={12} sm={6} p={{xs: 0, sm:'20px'}} pr={'0 !important'}>
      <Button
      fullWidth
      size="large"
      variant="outlined"
      onClick={()=>{chkEmailCode(getValues('Ctf_num'))}}
    >
      {t('CrtButton')}
      </Button>
      </Grid>
      </Grid>
      )}
      <TextField
        fullWidth
        label={t('Name')}
        margin="normal"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        fullWidth
        label={t('PWD')}
        margin="normal"
        type={'password'}
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        fullWidth
        label={t('PWDCHK')}
        margin="normal"
        type={'password'}
        {...register('passwordChk')}
        error={!!errors.passwordChk}
        helperText={errors.passwordChk?.message}
      />
      <Controller
        name='birth'
        control={control}
        render={({field: {onChange, value}})=>(
      <DesktopDatePicker
          label={t('Birth')}
          inputFormat="yyyy-MM-dd"
          mask='____-__-__'
          onChange={onChange}
          value={value}
          renderInput={(params) => 
            <TextField 
            fullWidth
            margin="normal"
            error={!!errors.birth}
            helperText={errors.birth?.message}
            {...params}
            {...register('birth')}
            />}
      />
        )}
      ></Controller>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: -1,
          mt: 1
        }}
      >
        <Checkbox
          {...register('policy')}
        />
        {lang === 'ko' ? (
          <Typography
          color="textSecondary"
          variant="body2"
        >
          <Link
            href="#"
          >
            {t('TermsAndConditions')}
          </Link>
          {t('IHaveRead')}

        </Typography>
        ) : (
          <Typography
          color="textSecondary"
          variant="body2"
        >
          {t('IHaveRead')}
          {' '}
          <Link
            href="#"
          >
            {t('TermsAndConditions')}
          </Link>
        </Typography>)}
      </Box>
      {Boolean(errors.policy) && (
        <FormHelperText error sx={{ml : 2}}>
          {errors.policy?.message}
        </FormHelperText>
      )}
      {errors.emailChk && !Boolean(errors.policy) && (
        <FormHelperText error sx={{ml : 2}}>
          {t('PleaseCE')}
        </FormHelperText>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {t('Register')}
        </Button>
      </Box>
    </form>
  );
};
