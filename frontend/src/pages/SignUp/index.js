import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import { login } from '../../utils/auth';
import { reduxLogin } from '../../store/modules/auth/actions';

import LogoIcon from '../../assets/Logo@icon.svg';
import { Form, Input, Button, TextArea } from '../../components/Form';
import { Container, H1 } from './styles';

export default function SignUp({ history }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    bio: '',
    urls: [''],
    skills: [],
  });

  useEffect(() => {
    async function loadRoles() {
      const { data } = await api.get('/v1/roles');

      setRoles(data);
    }

    loadRoles();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/v1/users', {
        name: form.name,
        bio: form.bio,
        nickname: form.nickname,
        email: form.email,
        password: form.password,
        urls: form.urls,
        roles: form.skills,
      });

      toast(t('signup.success'), {
        className: 'toast-background-success',
        bodyClassName: 'toast-font-size',
        progressClassName: 'toast-progress-bar-success',
        autoClose: 1500,
      });

      const { data } = await api.post('/v1/sessions', {
        email: form.email,
        password: form.password,
      });

      login(data.token);

      dispatch(
        reduxLogin({
          id: data.user.id,
          isAuth: true,
          name: data.user.name,
        })
      );

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

  function onChangeSkills(skill) {
    if (form.skills.includes(skill)) {
      form.skills = form.skills.filter(item => item !== skill);
    } else {
      form.skills.push(skill);
    }

    setForm({ ...form, skills: form.skills });
  }

  function addUrlField() {
    setForm({ ...form, urls: [...form.urls, ''] });
  }

  function removeUrlField(index) {
    form.urls.splice(index, 1);

    setForm({ ...form, urls: [...form.urls] });
  }

  async function onChangeUrl(e, index) {
    form.urls[index] = e.target.value;

    setForm({ ...form, urls: form.urls });
  }

  return (
    <Container>
      <img src={LogoIcon} alt="Logo" />
      <H1>{t('signup.title')}</H1>
      <small className="subTitle">{t('signup.subtitle')}</small>

      <Form onSubmit={handleSubmit}>
        <Input
          label={t('signup.name_label')}
          value={form.name}
          placeholder={t('signup.name_placeholder')}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label={t('signup.nickname_label')}
          value={form.nickname}
          placeholder={t('signup.nickname_placeholder')}
          onChange={e => setForm({ ...form, nickname: e.target.value })}
        />

        <Input
          label={t('signup.email_label')}
          type="email"
          value={form.email}
          placeholder={t('signup.email_placeholder')}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <Input
          label={t('signup.password_label')}
          value={form.password}
          placeholder={t('signup.password_placeholder')}
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <TextArea
          label={t('signup.bio_label')}
          value={form.bio}
          placeholder={t('signup.bio_placeholder')}
          rows="5"
          onChange={e => setForm({ ...form, bio: e.target.value })}
        />

        <h4 className="label">{t('signup.useful_urls')}</h4>
        <small style={{ textAlign: 'left' }}>{t('signup.urls_hint')}</small>
        <div className="urls">
          <div className="url_box">
            {form.urls.map((url, index) => (
              <div key={index} className="inner_input">
                <Input
                  placeholder={t('signup.url_placeholder')}
                  value={url}
                  onChange={e => onChangeUrl(e, index)}
                  style={{ marginBottom: '10px' }}
                />

                {form.urls.length > 1 ? (
                  <button
                    className="btn btn_remove"
                    type="button"
                    onClick={() => removeUrlField(index)}
                  >
                    <FaTimes />
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          <button className="btn btn_add" type="button" onClick={addUrlField}>
            <FaPlus />
          </button>
        </div>

        <h4 className="label" style={{ marginTop: '5x' }}>
          {t('signup.select_roles')}
        </h4>
        <div className="roles">
          {roles.map(role => (
            <label key={role.id} htmlFor={`roles${role.name}`}>
              <input
                id={`roles${role.name}`}
                className="checkbox"
                type="checkbox"
                name={role.name}
                value={role.id}
                onChange={e => onChangeSkills(e.target.value)}
              />
              <span className="checkmark" />
              {role.name}
            </label>
          ))}
        </div>

        <Button loading={isLoading ? 1 : 0} type="submit" text={t('signup.send_button')} />

        <span className="or">{t('signup.or_separator')}</span>

        <Link className="link" to="/app/login">
          {t('signup.login_link')}
        </Link>
      </Form>
      <ToastContainer />
    </Container>
  );
}
