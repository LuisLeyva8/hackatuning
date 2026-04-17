import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';
import { FaUsers, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadScreen';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Form, Input, TextArea } from '../../components/Form';
import { Container } from './styles';
import { CardTeam } from '../../components/Card/styles';

export default function ManageTeam({ match }) {
  const { id } = match.params;
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState({ creator: { name: '' }, members: [] });
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
  });

  useEffect(() => {
    async function loadTeam() {
      const { data } = await api.get(`/v1/teams/${id}`);

      setTeam(data);
      setLoading(false);
    }

    loadTeam();
  }, [id]);

  function filterTeam(memberId) {
    const newMembers = team.members.filter(member => member.id !== memberId);

    setTeam({ ...team, members: newMembers });
  }

  async function handleDeleteMember(teamId, memberId, name) {
    try {
      await api.delete(`/v1/teams/${teamId}/participants/${memberId}`);

      toast(t('manage_team.member_deleted', { name }), {
        className: 'toast-background-success',
        bodyClassName: 'toast-font-size',
        progressClassName: 'toast-progress-bar-success',
      });

      filterTeam(memberId);
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

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!team.project) {
        await api.post(`/v1/projects/teams/${team.id}`, {
          title: form.title,
          url: form.url,
          description: form.description,
        });
      }

      toast(t('manage_team.project_created'), {
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

  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>{t('manage_team.title')}</h1>

      <CardTeam key={team.id} style={{ maxWidth: 620, margin: '0 auto' }}>
        <div className="team-id">
          <p>{String(team.id).padStart(3, '0')}</p>
        </div>

        <div className="team-content">
          <div className="container">
            <div className="creator">
              {t('common.created_by')}{' '}
              <RouterLink
                target="_blank"
                to={`/${team.creator.nickname}`}
                className="link"
              >
                {team.creator.name}
              </RouterLink>
            </div>

            <div className="members">
              <FaUsers />
              <strong>{t('common.members')}</strong>
            </div>

            <div className="member">
              {team.members.length > 0 ? '' : t('common.no_members')}

              {team.members.map(member => (
                <div key={member.id} className="member__item">
                  <strong>{t('common.name')}</strong>
                  <p>{member.name}</p>
                  <div className="actions actions--left">
                    <RouterLink
                      target="_blank"
                      to={`/${member.nickname}`}
                      className="link"
                      style={{ marginRight: '20px' }}
                    >
                      Profile
                      <FaExternalLinkAlt class="external" size={15} />
                    </RouterLink>

                    <Button
                      color="#e3133e"
                      text={t('common.delete')}
                      onClick={() =>
                        handleDeleteMember(team.id, member.id, member.name)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardTeam>

      <Form onSubmit={handleSubmit}>
        <h2>{t('manage_team.team_project')}</h2>
        <Input
          label={t('manage_team.title_label')}
          onChange={e => setForm({ ...form, title: e.target.value })}
          value={form.title}
        />
        <Input
          label={t('manage_team.url_label')}
          onChange={e => setForm({ ...form, url: e.target.value })}
          value={form.url}
        />
        <TextArea
          label={t('manage_team.description_label')}
          onChange={e => setForm({ ...form, description: e.target.value })}
          value={form.description}
        />

        <Button text={t('manage_team.send_button')} loading={isLoading ? 1 : 0} />
      </Form>

      <ToastContainer />
    </Container>
  );
}
