import React, { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/LoadScreen';
import api from '../../services/api';
import { formatDate } from '../../utils/dateLocale';

import DefaultCover from '../../assets/default_cover.jpg';
import {
  Container,
  CarouselContainer,
  PageContainer,
  CardContainer,
  Card,
} from './styles';

export default function Home({ history }) {
  const [loading, setLoading] = useState(true);
  const [hackaCarousel, setHackaCarousel] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [pagination, setPagination] = useState({});
  const { t, i18n } = useTranslation();
  const perPage = 8;
  const searchURLParam = new URLSearchParams(history.location.search);
  const page = searchURLParam.get('page') || 1;

  useEffect(() => {
    async function loadHackathons() {
      const { data: dataCarousel } = await api.get(
        `/v1/hackathons?perPage=${perPage}&page=${page}&featured=3`
      );

      const { data } = await api.get(
        `/v1/hackathons?perPage=${perPage}&page=${page}&noFeatured=3`
      );

      setHackaCarousel(dataCarousel.hackathons);
      setHackathons(data.hackathons);
      setPagination(data.pagination);
      setLoading(false);
    }

    loadHackathons();
  }, [history.location.search, page]);

  async function handlePageChange(index) {
    const { data } = await api.get(
      `/v1/hackathons?noFeatured=3&perPage=${perPage}&page=${index.selected +
        1}`
    );

    setPagination(data.pagination);
    setHackathons(data.hackathons);
    history.push(`/?page=${index.selected + 1}`);
  }

  const homePage = (
    <>
      <Carousel autoPlay infiniteLoop interval={3000} showThumbs={false}>
        {hackaCarousel.map(hackathon => (
          <CarouselContainer
            key={hackathon.id}
            url={hackathon.cover ? hackathon.cover.url : DefaultCover}
          >
            <img
              id="cover"
              src={hackathon.cover ? hackathon.cover.url : DefaultCover}
              alt={`${hackathon.title} cover`}
            />

            <div className="content_container">
              <h2>{hackathon.title}</h2>
              <div className="organized">
                <span>
                  {t('common.organized_by')} <strong>{hackathon.organizer.name}</strong>
                </span>
              </div>

              <div>
                <FaRegCalendarAlt color="#fff" size={21} />
                <span>
                  {formatDate(parseISO(hackathon.event_date), "MMMM dd',' yyyy", i18n.language)}
                </span>
              </div>

              <div>
                <FaMapMarkerAlt color="#fff" size={21} />
                <span>{hackathon.online ? t('common.online') : hackathon.location}</span>
              </div>

              {hackathon.isParticipant ? (
                <Link to={`/app/hackathon/${hackathon.id}`}>{t('home.go_to_event')}</Link>
              ) : (
                <Link to={`/app/hackathon/${hackathon.id}/details`}>
                  {t('home.details')}
                </Link>
              )}
            </div>
          </CarouselContainer>
        ))}
      </Carousel>

      <PageContainer>
        <h1>{t('home.find_hackathons')}</h1>
        <CardContainer>
          {hackathons.map(hackathon => (
            <Card
              key={hackathon.id}
              url={hackathon.cover ? hackathon.cover.url : DefaultCover}
            >
              <div className="content">
                <header>
                  <h2>{hackathon.title}</h2>
                </header>

                <div className="card_content">
                  <div className="organized">
                    <span>
                      {t('common.organized_by')} <strong>{hackathon.organizer.name}</strong>
                    </span>
                  </div>

                  <div>
                    <FaRegCalendarAlt color="#1437E3" size={18} />
                    <span>
                      {formatDate(
                        parseISO(hackathon.event_date),
                        "MMMM dd',' yyyy",
                        i18n.language
                      )}
                    </span>
                  </div>

                  <div>
                    <FaMapMarkerAlt color="#1437E3" size={18} />
                    <span>
                      {hackathon.online ? t('common.online') : hackathon.location}
                    </span>
                  </div>

                  {hackathon.isParticipant ? (
                    <Link to={`/app/hackathon/${hackathon.id}`}>
                      {t('home.go_to_event')}
                    </Link>
                  ) : (
                    <Link to={`/app/hackathon/${hackathon.id}/details`}>
                      {t('home.details')}
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </CardContainer>
      </PageContainer>

      {pagination.maxPage > 1 ? (
        <ReactPaginate
          pageCount={pagination.maxPage}
          pageRangeDisplayed={3}
          marginPagesDisplayed={3}
          onPageChange={index => handlePageChange(index)}
          forcePage={pagination.currentPage - 1}
          containerClassName="pagination-container"
          activeLinkClassName="active"
          nextLabel="&#10095;"
          previousLabel="&#10094;"
        />
      ) : null}
    </>
  );

  return <Container>{loading ? <LoadingScreen /> : homePage}</Container>;
}
