import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../../components/LoadScreen';
import api from '../../services/api';

import DefaultAvatar from '../../assets/default-user-image.png';
import { Form, Input, TextArea, Button } from '../../components/Form';
import { Container, H1 } from './styles';

const mapStateToProps = state => ({
  user: state.auth,
});

export default connect(mapStateToProps)(function Settings({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([
    { id: undefined, name: '', checked: false },
  ]);
  const [avatar, setAvatar] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    bio: '',
    calendly: '',
    urls: [''],
    skills: [],
  });

  useEffect(() => {
    async function getUserData() {
      const { data } = await api.get(`/v1/users/${user.id}`);
      const rolesResponse = await api.get('/v1/roles');

      const arr = rolesResponse.data.map(role => {
        let bool = false;
        const isTrue = data.roles.filter(r => r.id === role.id).length;

        if (isTrue === 1) {
          bool = true;
        }

        return {
          id: role.id,
          name: role.name,
          checked: bool,
        };
      });

      setRoles(arr);
      setForm({
        name: data.name,
        nickname: data.nickname,
        bio: data.bio,
        calendly: data.calendly,
        urls: data.urls.map(url => url.url),
        skills: data.roles.map(role => role.id),
      });
      setIsMentor(data.is_mentor);
      setAvatar(data.avatar ? data.avatar.url : DefaultAvatar);
      setLoading(false);
    }

    getUserData();
  }, [user.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { name, bio, nickname, urls, skills, calendly } = form;
      const obj = {};

      if (name) obj.name = name;
      if (bio) obj.bio = bio;
      if (calendly) obj.calendly = calendly;
      if (nickname) obj.nickname = nickname;
      if (urls[0].length > 1) obj.urls = urls;
      if (skills.length > 1) obj.roles = skills;

      await api.put(`/v1/users`, obj);

      toast(t('settings.success'), {
        className: 'toast-background-success',
        bodyClassName: 'toast-font-size',
        progressClassName: 'toast-progress-bar-success',
      });

      setIsLoading(false);
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

  function onChangeSkills(skill, roleIndex) {
    const parsedSkill = Number(skill);
    if (form.skills.includes(parsedSkill)) {
      form.skills = form.skills.filter(item => item !== parsedSkill);
      roles[roleIndex].checked = false;
      setRoles(roles);
    } else {
      roles[roleIndex].checked = true;
      setRoles(roles);

      form.skills.push(parsedSkill);
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

  async function onFileChange(e) {
    try {
      const formData = new FormData();

      const file = e.target.files[0];

      formData.append('file', file);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      e.target.value = '';

      const { data } = await api.post(`/v1/files/users`, formData, config);

      if (data.url) {
        toast(t('settings.avatar_success'), {
          className: 'toast-background-success',
          bodyClassName: 'toast-font-size',
          progressClassName: 'toast-progress-bar-success',
        });
      } else {
        toast(t('settings.avatar_error'), {
          className: 'toast-background',
          bodyClassName: 'toast-font-size',
          progressClassName: 'toast-progress-bar',
        });
      }

      setAvatar(data.url);
    } catch (error) {
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

  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      <H1>{t('settings.title')}</H1>

      <img
        id="avatarFiles"
        src={avatar}
        alt="user"
        style={{ maxWidth: 200, maxHeight: 200 }}
      />

      <Form onSubmit={handleSubmit}>
        <p className="label" style={{ marginTop: '20px' }}>
          {t('settings.avatar_label')}
        </p>
        <input
          className="file"
          id="fileAvatar"
          type="file"
          onChange={e => onFileChange(e)}
        />

        <Input
          label={t('settings.name_label')}
          value={form.name}
          placeholder={t('settings.name_placeholder')}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label={t('settings.nickname_label')}
          value={form.nickname}
          placeholder={t('settings.nickname_placeholder')}
          onChange={e => setForm({ ...form, nickname: e.target.value })}
        />

        {isMentor ? (
          <Input
            label={t('settings.calendly_label')}
            value={form.calendly}
            placeholder={t('settings.calendly_placeholder')}
            onChange={e => setForm({ ...form, calendly: e.target.value })}
          />
        ) : null}

        <TextArea
          label={t('settings.bio_label')}
          placeholder={t('settings.bio_placeholder')}
          rows="5"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
        />

        <h4>{t('settings.useful_urls')}</h4>
        <small>{t('settings.urls_hint')}</small>
        <div className="urls">
          <div className="url_box">
            {form.urls.map((url, index) => (
              <div key={index} className="inner_input">
                <Input
                  style={{ marginBottom: '10px' }}
                  placeholder={t('settings.url_placeholder')}
                  value={url}
                  onChange={e => onChangeUrl(e, index)}
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

        <h4>{t('settings.select_roles')}</h4>
        <div className="roles">
          {roles.map((role, roleIndex) => (
            <label key={role.name} htmlFor={role.name}>
              <input
                className="checkbox"
                id={role.name}
                checked={role.checked}
                type="checkbox"
                value={role.id}
                onChange={e => onChangeSkills(e.target.value, roleIndex)}
              />
              {role.name}
            </label>
          ))}
        </div>

        <Button loading={isLoading ? 1 : 0} text={t('settings.send_button')} />
      </Form>
      <ToastContainer />
    </Container>
  );
});
