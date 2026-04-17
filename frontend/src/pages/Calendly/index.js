import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

import { Input, Form, Button } from '../../components/Form';
import { Container } from './styles';

const mapStateToProps = state => ({
  user: state.auth,
});

export default connect(mapStateToProps)(function Calendly({ user, history }) {
  const [calendly, setCalendly] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function loadUser() {
      const { data } = await api.get(`/v1/users/${user.id}`);

      if (data.is_mentor && data.is_mentor === false) history.push('/');
    }

    loadUser();
  }, [user.id, history]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put(`/v1/users`, {
        calendly,
      });

      toast(t('calendly.success'), {
        className: 'toast-background-success',
        bodyClassName: 'toast-font-size',
        progressClassName: 'toast-progress-bar-success',
        autoClose: 1500,
      });

      setTimeout(() => {
        history.push('/');
      }, 1500);
    } catch (error) {
      setIsLoading(false);

      toast(
        error.response.data.fields
          ? error.response.data.fields[0].message
          : error.response.data.message,
        {
          className: 'toast-background',
          bodyClassName: 'toast-font-size',
          progressClassName: 'toast-progress-bar',
        }
      );
    }
  }

  return (
    <Container onSubmit={handleSubmit}>
      <h1>{t('calendly.title')}</h1>
      <small>
        {t('calendly.description')}{' '}
        <a href="https://calendly.com/">Calendly.</a>
      </small>

      <Form>
        <Input
          label={t('calendly.url_label')}
          onChange={e => setCalendly(e.target.value)}
          value={calendly}
        />

        <Button loading={isLoading ? 1 : 0} text={t('calendly.send_button')} />
      </Form>

      <ToastContainer />
    </Container>
  );
});
