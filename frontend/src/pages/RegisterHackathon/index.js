import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import {
  Form,
  Input,
  TextArea,
  Button,
  InputArray,
} from '../../components/Form/index';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

import { Container } from './styles';

export default function RegisterHackathon({ history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    online: false,
    event_date: new Date(),
    deadline_subscription: new Date(),
    event_ending: new Date(),
    deadline_team_creation: new Date(),
    awards: '',
    min_participants: 1,
    max_participants: 9999,
    mentors: [''],
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formData;
    let config = {};

    if (form.online) form.location = 'online';
    setForm(form);

    if (file) {
      formData = new FormData();
      formData.append('file', file);
      config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
    }

    try {
      const { data } = await api.post('/v1/hackathons', form);

      if (formData)
        await api.post(`/v1/files/hackathons/${data.id}`, formData, config);

      if (form.mentors.length >= 0 && form.mentors[0] !== '')
        await api.post(`/v1/hackathons/${data.id}/mentors/invite`, {
          emails: form.mentors,
        });

      toast(t('register_hackathon.success'), {
        className: 'toast-background-success',
        bodyClassName: 'toast-font-size',
        progressClassName: 'toast-progress-bar-success',
      });

      setTimeout(() => {
        history.push('/app/hackathons');
      }, 2000);
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

  async function onChangeMentorMail(e, index) {
    form.mentors[index] = e.target.value;

    setForm({ ...form, mentors: form.mentors });
  }

  function addMentorField() {
    setForm({ ...form, mentors: [...form.mentors, ''] });
  }

  function removeMentorField(index) {
    form.mentors.splice(index, 1);

    setForm({ ...form, mentors: [...form.mentors] });
  }

  return (
    <Container>
      <h1 style={{ textAlign: 'center' }}>{t('register_hackathon.title')}</h1>

      <Form onSubmit={handleSubmit}>
        <p className="label" style={{ marginTop: '20px' }}>
          {t('register_hackathon.cover_label')}
        </p>

        <input
          className="file"
          id="cover"
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />

        <Input
          label={t('register_hackathon.title_label')}
          type="text"
          value={form.title}
          placeholder={t('register_hackathon.title_placeholder')}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <Input
          label={t('register_hackathon.subtitle_label')}
          type="text"
          placeholder={t('register_hackathon.subtitle_placeholder')}
          value={form.subtitle}
          onChange={e => setForm({ ...form, subtitle: e.target.value })}
        />

        <TextArea
          label={t('register_hackathon.description_label')}
          value={form.description}
          placeholder={t('register_hackathon.description_placeholder')}
          rows="7"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <label
          htmlFor="checkbox"
          className="label"
          style={{ marginBottom: '10px' }}
        >
          {t('register_hackathon.online_label')}
          <input
            id="checkbox"
            type="checkbox"
            value={form.online}
            style={{ marginLeft: '10px' }}
            onChange={() => setForm({ ...form, online: !form.online })}
          />
        </label>

        {form.online ? null : (
          <Input
            label={t('register_hackathon.location_label')}
            type="text"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
        )}

        <Input
          label={t('register_hackathon.min_participants_label')}
          type="number"
          value={form.min_participants}
          style={{ width: 100, marginLeft: 11 }}
          placeholder={t('register_hackathon.min_placeholder')}
          onChange={e => setForm({ ...form, min_participants: e.target.value })}
        />

        <Input
          label={t('register_hackathon.max_participants_label')}
          type="number"
          placeholder={t('register_hackathon.max_placeholder')}
          value={form.max_participants}
          style={{ width: 100, marginLeft: 10 }}
          onChange={e => setForm({ ...form, max_participants: e.target.value })}
        />

        <TextArea
          label={t('register_hackathon.awards_label')}
          placeholder={t('register_hackathon.awards_placeholder')}
          rows="4"
          value={form.awards}
          onChange={e => setForm({ ...form, awards: e.target.value })}
        />

        <p className="label">{t('register_hackathon.event_beginning')}</p>
        <DatePicker
          className="input"
          id="event_date"
          selected={form.event_date}
          value={form.event_date}
          showTimeInput
          onClickOutside
          shouldCloseOnSelect
          time
          onChange={date => setForm({ ...form, event_date: new Date(date) })}
        />

        <p className="label">{t('register_hackathon.event_ending')}</p>
        <DatePicker
          className="input"
          id="event_ending"
          selected={form.event_ending}
          value={form.event_ending}
          showTimeInput
          onClickOutside
          shouldCloseOnSelect
          time
          onChange={date => setForm({ ...form, event_ending: new Date(date) })}
        />

        <p className="label">{t('register_hackathon.end_subscription')}</p>
        <DatePicker
          className="input"
          id="deadline_subscription"
          selected={form.deadline_subscription}
          value={form.deadline_subscription}
          showTimeInput
          onClickOutside
          shouldCloseOnSelect
          time
          onChange={date =>
            setForm({ ...form, deadline_subscription: new Date(date) })
          }
        />

        <p className="label">{t('register_hackathon.end_team_creation')}</p>
        <DatePicker
          className="input"
          id="deadline_team_creation"
          selected={form.deadline_team_creation}
          value={form.deadline_team_creation}
          showTimeInput
          onClickOutside
          shouldCloseOnSelect
          time
          onChange={date =>
            setForm({ ...form, deadline_team_creation: new Date(date) })
          }
        />

        <h2>{t('register_hackathon.invite_mentors')}</h2>

        <small>{t('register_hackathon.mentor_email_hint')}</small>

        <InputArray
          values={form.mentors}
          onChange={onChangeMentorMail}
          addField={addMentorField}
          removeField={removeMentorField}
          label={t('register_hackathon.email_label')}
        />

        <Button loading={isLoading ? 1 : 0} text={t('register_hackathon.send_button')} type="submit" />
      </Form>

      <ToastContainer />
    </Container>
  );
}
