import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { login } from '../../utils/auth';
import { reduxLogin } from '../../store/modules/auth/actions';

import LogoIcon from '../../assets/Logo@icon.svg';
import { Container } from './styles';
import { Form, Button, Input } from '../../components/Form';

export default function SignIn({ history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post('/v1/sessions', {
        email,
        password,
      });

      login(data.token);

      dispatch(
        reduxLogin({
          id: data.user.id,
          isAuth: true,
          name: data.user.name,
        })
      );

      history.push('/');
    } catch (error) {
      let errMsg;
      setIsLoading(false);

      if (error.response.status === 429) {
        errMsg = t('signin.rate_limit_error');
      } else if (error.response.data.fields) {
        errMsg = error.response.data.fields[0].message;
      } else {
        errMsg = error.response.data.message;
      }

      toast(errMsg, {
        className: 'toast-background',
        bodyClassName: 'toast-font-size',
        progressClassName: 'toast-progress-bar',
      });
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <img src={LogoIcon} alt="logo" style={{ marginBottom: 20 }} />
        <h1>{t('signin.title')}</h1>
        <small>{t('signin.subtitle')}</small>

        <Input
          label={t('signin.email_label')}
          type="email"
          placeholder={t('signin.email_placeholder')}
          onChange={e => setEmail(e.target.value)}
          value={email}
        />

        <Input
          label={t('signin.password_label')}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder={t('signin.password_placeholder')}
          value={password}
        />

        <Button loading={isLoading ? 1 : 0} type="submit" text={t('signin.button')} />

        <Link className="link" to="/app/register">
          {t('signin.register_link')}
        </Link>
      </Form>

      <ToastContainer />
    </Container>
  );
}
