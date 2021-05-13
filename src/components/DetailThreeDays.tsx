import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { convertWeaterInfo } from 'src/shared/common';

import { useSelector } from 'react-redux';
import { RootState } from '../redux/modules';

import { Button, Card, Grid, Title } from './elements';

const DetailThreeDays = (props) => {
  const { category, history } = props;
  const { livingHealthWeather } = useSelector((state: RootState) => state.weather.weatherInfo);

  const [type, setType] = useState(null);
  const [todayDes, setTodayDes] = useState(null);
  const [tomorrowDes, setTomorrowDes] = useState(null);
  const [afterTomorrow, setAfterTomorrow] = useState(null);

  const title = {
    uv: '자외선 지수',
    asthma: '폐질환 위험 지수',
    foodPoison: '식중독 위험 지수',
    oakPollenRisk: '꽃가루 농도 지수',
  };

  const setAllDesData = () => {
    const keys = Object.keys(livingHealthWeather);

    const data = keys.forEach((key, idx) => {
      if (key.indexOf(category) > -1) {
        const day = key.split(category)[1];
        const value = livingHealthWeather[key];

        let type = category;
        if (category === 'oakPollenRisk') {
          type = 'pollenRisk';
        }
        if (day === 'Today') {
          setTodayDes(convertWeaterInfo(type, value));
        }

        if (day === 'Tomorrow') {
          setTomorrowDes(convertWeaterInfo(type, value));
        }

        if (day === 'TheDayAfterTomorrow') {
          setAfterTomorrow(convertWeaterInfo(type, value));
        }
      }
    }, []);
  };
  useEffect(() => {
    if (!livingHealthWeather) return;
    setAllDesData();
  }, []);

  return (
    <Container>
      <Title>{title[category]}</Title>
      <CardWrapper>
        <Card
          width="30%"
          height="150px"
          cardTitle="오늘"
          cardDescription={todayDes}
          iconName={category === 'oakPollenRisk' ? 'pollenRisk' : category}
        />
        <Card
          width="30%"
          height="150px"
          cardTitle="내일"
          cardDescription={tomorrowDes}
          iconName={category === 'oakPollenRisk' ? 'pollenRisk' : category}
        />
        <Card
          width="30%"
          height="150px"
          cardTitle="모레"
          cardDescription={afterTomorrow}
          iconName={category === 'oakPollenRisk' ? 'pollenRisk' : category}
        />
      </CardWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: ${(props) => props.theme.view.width};
  height: 100%;
  ${(props) => props.theme.flex.column};
  justify-content: space-around;
`;

const CardWrapper = styled.div`
  width: 100%;
  height: 50%;
  ${(props) => props.theme.border_box};
  ${(props) => props.theme.flex.row};
  padding: 1rem;
`;

export default DetailThreeDays;
