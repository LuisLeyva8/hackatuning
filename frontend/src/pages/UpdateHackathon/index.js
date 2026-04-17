import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadScreen';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

import DefaultCover from '../../assets/default_cover.jpg';
import { Form, Input, TextArea, Button } from '../../components/Form';
import { Container } from './styles';

export default function UpdateHackathon({ match }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cover, setCover] = useState();
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
  });

  useEffect(() => {
    async function loadHackathon() {
      const { id } = match.params;

      const { data } = await api.get(`/v1/hackathons/${id}`);

      if (data.cover) {
        setCover(data.cover.url);
      }

      setForm({
        title: data.title,
        subtitle: data.subtitle,
        online: data.online,
        location: data.location,
        description: data.description,
        awards: data.awards,
        min_participants: data.min_participants,
        max_participants: data.max_participants,
        event_date: parseISO(data.event_date),
        deadline_subscription: parseISO(data.deadline_subscription),
        deadline_team_creation: parseISO(data.deadline_team_creation),
        event_ending: parseISO(data.event_ending),
      });

      setLoading(false);
    }

    loadHackathon();
  }, [match.params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const { id } = match.params;

    const obj = { ...form };

    if (form.online) obj.location = 'online';

    try {
      await api.put(`/v1/hackathons/${id}`, obj);

      toast(t('update_hackathon.success'), {
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

  async function handleFileChange(e) {
    try {
      const { id } = match.params;
      const formData = new FormData();

      const file = e.target.files[0];

      formData.append('file', file);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      e.target.value = '';

      const { data } = await api.post(
        `/v1/files/hackathons/${id}`,
        formData,
        config
      );

      if (data.url) {
        toast(t('update_hackathon.cover_success'), {
          className: 'toast-background-success',
          bodyClassName: 'toast-font-size',
          progressClassName: 'toast-progress-bar-success',
        });
      } else {
        toast(t('update_hackathon.cover_error'), {
          className: 'toast-background',
          bodyClassName: 'toast-font-size',
          progressClassName: 'toast-progress-bar',
        });
      }

      setCover(data.url);
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
      <h1>{t('update_hackathon.title')}</h1>

      <Form onSubmit={handleSubmit}>
        <img
          src={cover || DefaultCover}
          alt={`${form.title}cover`}
          style={{ maxWidth: 200, maxHeight: 200, margin: '30px auto' }}
        />

        <p className="label">{t('update_hackathon.cover_label')}</p>

        <label htmlFor="file">
          <input
            className="file"
            id="file"
            type="file"
            onChange={e => handleFileChange(e)}
          />
        </label>

        <Input
          label={t('update_hackathon.title_label')}
          onChange={e => setForm({ ...form, title: e.target.value })}
          value={form.title}
        />

        <Input
          label={t('update_hackathon.subtitle_label')}
          onChange={e => setForm({ ...form, subtitle: e.target.value })}
          value={form.subtitle}
        />

        <TextArea
          label={t('update_hackathon.description_label')}
          onChange={e => setForm({ ...form, description: e.target.value })}
          value={form.description}
          rows="7"
        />

        <label
          htmlFor="checkbox"
          className="label"
          style={{ marginBottom: '10px' }}
        >
          {t('update_hackathon.online_label')}
          <input
            checked={form.online}
            id="checkbox"
            type="checkbox"
            value={form.online}
            style={{ marginLeft: '10px' }}
            onChange={() => setForm({ ...form, online: !form.online })}
          />
        </label>

        {!form.online ? (
          <Input
            label={t('update_hackathon.location_label')}
            onChange={e => setForm({ ...form, location: e.target.value })}
            value={form.location}
          />
        ) : null}

        <TextArea
          label={t('update_hackathon.awards_label')}
          rows="4"
          onChange={e => setForm({ ...form, awards: e.target.value })}
          value={form.awards}
        />

        <Input
          label={t('update_hackathon.min_participants_label')}
          type="number"
          onChange={e => setForm({ ...form, min_participants: e.target.value })}
          value={form.min_participants}
          style={{ width: 100, marginLeft: 10 }}
        />

        <Input
          label={t('update_hackathon.max_participants_label')}
          type="number"
          onChange={e => setForm({ ...form, max_participants: e.target.value })}
          value={form.max_participants}
          style={{ width: 100, marginLeft: 10 }}
        />

        <p className="label">{t('update_hackathon.event_beginning')}</p>
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

        <p className="label">{t('update_hackathon.event_ending')}</p>
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

        <p className="label">{t('update_hackathon.end_subscription')}</p>
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

        <p className="label">{t('update_hackathon.end_team_creation')}</p>
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

        <Button loading={isLoading ? 1 : 0} type="submit" text={t('update_hackathon.send_button')} />
      </Form>

      <ToastContainer />
    </Container>
  );
}
