import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectIsAuth, fetchRegister } from './../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: 'ogonick ogonickovich',
      email: 'test@email.com',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))

    if (!data.payload) {
      return alert('registration error')
    }
    if (data.payload.token) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }
  if (isAuth) {
    return <Navigate to='/' />
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type='text'
          className={styles.field}
          label="Full Name"
          error={Boolean(errors.fullNmae?.message)}
          helperText={errors.fullNmae?.message}
          {...register('fullName', { required: 'write your full name' })}
          fullWidth />
        <TextField
          type='email'
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'write email adress' })}
          fullWidth />
        <TextField
          type='password'
          className={styles.field}
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'write passwort' })}
          fullWidth />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
