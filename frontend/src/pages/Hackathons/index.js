import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadScreen';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import { formatDate } from '../../utils/dateLocale';

import DefaultCover from '../../assets/default_cover.jpg';
import Link from '../../components/Link';
import { Button } from '../../components/Form';
import {
  Container,
  Card,
  ParticipantContainer,
  ManageHackathonContainer,
} from './styles';

export default function Hackathons() {
  const [loading, setLoading] = useState(true);
  const [meParticipants, setMeParticipants] = useState([]);
  const [meHackathons, setMeHackathons] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    async function loadData() {
      const { data: participantsData } = await api.get(
        '/v1/me/participants/hackas'
      );
      const { data: hackData } = await api.get('/v1/me/hackas');

      setMeHackathons(hackData.hackathons);
      setMeParticipants(participantsData.hackathons);
      setLoading(false);
    }

    loadData();
  }, []);

  async function handleDeleteHackathon(id) {
    try {
      // eslint-disable-next-line no-alert
      const action = window.confirm(t('common.confirm_delete'));

      if (action) {
        await api.delete(`/v1/hackathons/${id}`);

        const newMeHackathons = meHackathons.filter(
          hackathon => hackathon.id !== id
        );

        setMeHackathons(newMeHackathons);

        toast(t('hackathons.deleted'), {
          className: 'toast-background-success',
          bodyClassName: 'toast-font-size',
          progressClassName: 'toast-progress-bar-success',
        });
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

  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      <h1>{t('hackathons.title')}</h1>
      <h2 className="heading_section">{t('hackathons.manage_section')}</h2>
      <ManageHackathonContainer>
        {meHackathons.length > 0 ? (
          meHackathons.map(hackathon => (
            <Card
              key={hackathon.id}
              url={hackathon.cover ? hackathon.cover.url : DefaultCover}
            >
              <div className="content">
                <header>
                  <h2>{hackathon.title}</h2>
                </header>

                <div className="card_content">
                  <div>
                    <p className="subtitle">{hackathon.subtitle}</p>
                  </div>

                  <div>
                    <FaRegCalendarAlt color="#1437E3" size={18} />
                    <span>
                      {t('hackathons.start')}{' '}
                      {formatDate(
                        parseISO(hackathon.event_date),
                        "MMMM dd',' yyyy",
                        i18n.language
                      )}
                    </span>
                  </div>

                  <div>
                    <FaRegCalendarAlt color="#1437E3" size={18} />
                    <span>
                      {t('hackathons.end')}{' '}
                      {formatDate(
                        parseISO(hackathon.event_ending),
                        "MMMM dd',' yyyy",
                        i18n.language
                      )}
                    </span>
                  </div>

                  <div className="actions">
                    <Link
                      to={`/app/hackathon/${hackathon.id}/details`}
                      text={t('hackathons.details')}
                      style={{
                        maxWidth: '80px',
                        backgroundColor: 'green',
                        marginRight: '10px',
                      }}
                    />
                    <Link
                      to={`/app/hackathon/${hackathon.id}/edit`}
                      text={t('hackathons.edit')}
                    />
                    <Button
                      text={t('hackathons.delete')}
                      color="#E3143E"
                      type="button"
                      onClick={() => handleDeleteHackathon(hackathon.id)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <h3>{t('hackathons.no_manage')}</h3>
        )}
      </ManageHackathonContainer>

      <h2 className="heading_section">{t('hackathons.participating_section')}</h2>
      <ParticipantContainer>
        {meParticipants.length > 0 ? (
          meParticipants.map(participant => (
            <Card
              key={participant.id}
              url={participant.cover ? participant.cover.url : DefaultCover}
            >
              <div className="content">
                <header>
                  <h2>{participant.title}</h2>
                </header>

                <div className="card_content">
                  <div>
                    <p className="subtitle">{participant.subtitle}</p>
                  </div>

                  <div>
                    <FaRegCalendarAlt color="#1437E3" size={18} />
                    <span>
                      {t('hackathons.start')}{' '}
                      {formatDate(
                        parseISO(participant.event_date),
                        "MMMM dd',' yyyy",
                        i18n.language
                      )}
                    </span>
                  </div>

                  <div>
                    <FaRegCalendarAlt color="#1437E3" size={18} />
                    <span>
                      {t('hackathons.end')}{' '}
                      {formatDate(
                        parseISO(participant.event_ending),
                        "MMMM dd',' yyyy",
                        i18n.language
                      )}
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/app/hackathon/${participant.id}`}
                      text={t('hackathons.go_to_event')}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <h3>{t('hackathons.no_participating')}</h3>
        )}
      </ParticipantContainer>

      <ToastContainer />
    </Container>
  );
}
