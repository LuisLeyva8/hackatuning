import React, { useEffect, useState } from 'react';
import { FaUsers, FaExternalLinkAlt, FaUserCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadScreen';
import api from '../../services/api';
import Link from '../../components/Link';

import { CardTeam } from '../../components/Card/styles';
import { TeamContent } from './styles';
import { Container, Content } from '../HackathonEvent/styles';

export default function SeeAllTeams({ history, match }) {
  const { id } = match.params;
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [hackathon, setHackathon] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    async function laodteams() {
      try {
        const { data } = await api.get(`/v1/teams/hackathons/${id}`);
        const { data: hackResponse } = await api.get(`/v1/hackathons/${id}`);

        setHackathon(hackResponse);
        setTeams(data.teams);
        setLoading(false);
      } catch (error) {
        history.push('/');
      }
    }

    laodteams();
  }, [id, history]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      <h1>{hackathon.title}</h1>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
        {hackathon.subtitle}
      </h2>

      <Content>
        <div
          className="buttons"
          style={{ marginBottom: '35px', marginTop: '5px' }}
        >
          <Link
            to={`/app/hackathon/${id}`}
            text={t('see_all_teams.see_participants')}
          />
        </div>

        <TeamContent>
          {teams.map(team => (
            <div className="box">
              <CardTeam style={{ width: '100%' }}>
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
                      {team.members.length > 0
                        ? ''
                        : t('common.no_members')}
                      {team.members.map(member => (
                        <RouterLink
                          target="_blank"
                          to={`/${member.member.nickname}`}
                          className="member__link"
                        >
                          <FaUserCircle className="link" size={25} />{' '}
                          {member.member.name}{' '}
                          <FaExternalLinkAlt class="external" size={15} />
                        </RouterLink>
                      ))}
                    </div>
                  </div>
                </div>
              </CardTeam>
            </div>
          ))}
        </TeamContent>
      </Content>
    </Container>
  );
}
