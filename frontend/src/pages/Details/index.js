/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPenAlt,
  FaUsers,
  FaRegCalendarAlt,
  FaTrophy,
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadScreen';
import api from '../../services/api';
import { Form, Button } from '../../components/Form';
import Link from '../../components/Link';
import { formatDate } from '../../utils/dateLocale';
import 'react-datepicker/dist/react-datepicker.css';

import DefaultCover from '../../assets/default_cover.jpg';
import DefaultAvatar from '../../assets/default-user-image.png';
import { Container } from './styles';
import { isAuthenticated } from '../../utils/auth';

export default function Details({ match, history }) {
  const [loading, setLoading] = useState(true);
  const hackathonId = match.params.id;
  const { t, i18n } = useTranslation();
  const [hackathon, setHackathon] = useState({
    cover: { url: '' },
    organizer: { name: '', avatar: { url: '' } },
  });

  useEffect(() => {
    async function loadHackathon() {
      const { data } = await api.get(`/v1/hackathons/${hackathonId}`);

      setHackathon(data);
      setLoading(false);
    }

    loadHackathon();
  }, [hackathonId]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isAuthenticated()) {
        await api.post(`/v1/hackathons/${hackathonId}/participants`);

        history.push(`/app/hackathon/${hackathonId}`);
      } else {
        history.push(`/app/login`);
      }
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

  const formatLocalDate = iso =>
    formatDate(parseISO(iso), 'MM/dd/yyyy', i18n.language);

  return loading ? (
    <LoadingScreen />
  ) : (
    <Container url={hackathon.cover ? hackathon.cover.url : DefaultCover}>
      <div className="image_container">
        <div className="header__text">
          <h1>{hackathon.title}</h1>
          <div className="organizer">
            <h2>
              <span>{t('details.organized_by')}</span>
              <img
                src={
                  hackathon.organizer.avatar
                    ? hackathon.organizer.avatar.url
                    : DefaultAvatar
                }
                alt={hackathon.organizer.name}
              />
              <strong>
                <RouterLink
                  target="_blank"
                  to={`/${hackathon.organizer.nickname}`}
                  className="profile__link"
                >
                  {hackathon.organizer.name}
                </RouterLink>
              </strong>
            </h2>
          </div>
        </div>

        <div className="header__button">
          {isAuthenticated() ? (
            hackathon.isParticipant ? (
              <Link to={`/app/hackathon/${hackathon.id}`} text={t('details.go_to_event')} />
            ) : (
              <Form onSubmit={handleSubmit}>
                <Button
                  text={t('details.subscribe')}
                  style={{ width: 240, margin: '20px auto' }}
                />
              </Form>
            )
          ) : (
            <Form onSubmit={handleSubmit}>
              <Button
                text={t('details.sign_in')}
                style={{ width: 240, margin: '20px auto' }}
              />
            </Form>
          )}
        </div>
      </div>

      <div className="details">
        <div className="details__photo">
          <img
            id="cover"
            src={hackathon.cover ? hackathon.cover.url : DefaultCover}
            alt={`${hackathon.title} cover`}
          />

          <div className="details__awards">
            <FaTrophy size={47} />
            <p>
              {hackathon.awards
                ? hackathon.awards
                : t('details.no_awards')}
            </p>
          </div>
        </div>

        <div className="details__desc">
          <div className="details__dates">
            <div>
              <FaPenAlt />
              <span>
                <strong>{t('details.registrations')}</strong>
                {t('common.until')} {formatLocalDate(hackathon.deadline_subscription)}
              </span>
            </div>

            <div>
              <FaUsers />
              <span>
                <strong>{t('details.create_teams')}</strong>
                {t('common.until')} {formatLocalDate(hackathon.deadline_team_creation)}
              </span>
            </div>

            <div>
              <FaRegCalendarAlt />
              <span>
                <strong>{t('details.event')}</strong>
                {formatLocalDate(hackathon.event_date)} {t('details.to')} {formatLocalDate(hackathon.event_ending)}
              </span>
            </div>

            <div>
              <FaMapMarkerAlt />
              <span className="dates__locale">
                {!hackathon.online ? hackathon.location : t('common.online')}
              </span>
            </div>
          </div>

          <div className="details__text">
            <h3>{hackathon.subtitle}</h3>
            <p>{hackathon.description}</p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </Container>
  );
}
