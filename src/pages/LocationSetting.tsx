import { current } from 'immer';
import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Title, Toast } from 'src/components/elements';

import styled from 'styled-components';

import { weatherActions } from 'src/redux/modules/weather';
import { locationActions } from 'src/redux/modules/location';

import { HiCheck, HiXCircle } from 'react-icons/hi';

import Footer from 'src/components/Footer';
import { css } from '@emotion/core';
import BeatLoader from 'react-spinners/BeatLoader';

import { RootState } from '../redux/modules';

const LocationSetting = (props) => {
  const { history } = props;
  const dispatch = useDispatch();

  const [toastMsg, setToastMsg] = useState(null); // 토스트 메시지
  const [isShowToast, setIsShowToast] = useState<boolean>(false); // 토스트 보이기
  const [timerState, setTimerState] = useState(null); // 토스트 timeout

  const [currentRegion, setCurrentRegion] = useState(null); // 현재위치
  const [selectedRegion, setSelectedRegion] = useState(null); // 선택한 위치

  const [isEditMode, setIsEditMode] = useState<boolean>(false); // 편집모드
  const [deleteList, setDeleteList] = useState([]); // 지역삭제목록

  const { userLocationInfo, loading } = useSelector((state: RootState) => state.location);

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(locationActions.fetchUserRegion());

    return () => {
      clearTimeout(timerState);
      setIsShowToast(false);
    };
  }, []);

  useEffect(() => {
    if (userLocationInfo) {
      const current = userLocationInfo.currentRegion;
      const fullRegionName = `${current.bigRegionName} ${current.smallRegionName}`;
      setCurrentRegion(fullRegionName);

      setSelectedRegion(localStorage.getItem('current-region') || fullRegionName);
    }
  }, [userLocationInfo]);

  const openToast = (msg) => {
    if (timerState) {
      clearTimeout(timerState);
    }
    setIsShowToast(true);
    setToastMsg(msg);

    const timer = setTimeout(() => {
      setIsShowToast(false);
    }, 3000);

    setTimerState(timer);
  };

  const addDeleteList = (region) => {
    if (selectedRegion === region) {
      openToast('선택한 위치는 삭제할 수 없습니다');
      return;
    }
    setDeleteList([...deleteList, region]);
  };

  const selectRegion = (region) => {
    localStorage.setItem('current-region', region);
    setSelectedRegion(region);
    dispatch(weatherActions.getWeatherInfo());
    openToast('선택한 위치로 변경했습니다');
  };
  const onClickRegionCard = (region) => () => {
    if (isEditMode) {
      addDeleteList(region);
    } else {
      selectRegion(region);
    }
  };

  const onClickCurrentRegion = () => {
    if (isEditMode) return;
    localStorage.removeItem('current-region');
    setSelectedRegion(currentRegion);
    openToast('현재 위치로 변경했습니다');

    dispatch(weatherActions.getWeatherInfo());
  };

  const IconComponent = () => {
    if (isEditMode) {
      return <HiXCircle className="cancel" />;
    }

    return <HiCheck className="check" />;
  };

  const locationCardList = userLocationInfo?.oftenSeenRegions?.reduce((acc, cur, idx) => {
    if (!deleteList.includes(cur)) {
      acc.push(
        <LocationCard onClick={onClickRegionCard(cur)} key={idx} isSelected={!isEditMode && selectedRegion === cur}>
          {cur}
          <IconComponent />
        </LocationCard>,
      );
    }

    return acc;
  }, []);

  const onClickEditButton = () => {
    if (isEditMode) {
      cancleEdit();
    } else {
      toggleEditMode();
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const cancleEdit = () => {
    setDeleteList([]);
    toggleEditMode();
  };

  const onClickAddButton = () => {
    if (isEditMode) {
      removeLocationList();
    } else {
      goToAddPage();
    }
  };

  const goToAddPage = () => {
    history.push('/setting/location/add');
  };

  const removeLocationList = async () => {
    if (deleteList.length > 0) {
      const oftenSeenRegions = userLocationInfo.oftenSeenRegions.filter((reg) => {
        return !deleteList.includes(reg);
      });

      await dispatch(locationActions.fetchUpdateUserRegion({ oftenSeenRegions }));

      await openToast('선택한 위치를 삭제했습니다');
    }

    await toggleEditMode();
  };

  return (
    <>
      <Container>
        <Header width="100%">
          <button type="button" onClick={onClickEditButton}>
            {isEditMode ? '취소' : '편집'}
          </button>
          <Title>위치 설정</Title>
          <button type="button" onClick={onClickAddButton}>
            {isEditMode ? '완료' : '추가'}
          </button>
        </Header>
        <Wrapper>
          <LocationCard
            onClick={onClickCurrentRegion}
            isSelected={!isEditMode && (!userLocationInfo?.latestRequestRegion || selectedRegion === currentRegion)}
          >
            <Grid isColumn>
              <span className="current">현재 위치</span>
              <span>{currentRegion}</span>
            </Grid>
            <HiCheck className="check" />
          </LocationCard>
          {locationCardList}
        </Wrapper>
      </Container>

      <Footer history={history} />

      {isShowToast && <Toast>{toastMsg}</Toast>}
      <BeatLoader color="#738FFF" loading={loading} css={spinnerStyle} />
    </>
  );
};

const Container = styled.div`
  width: 360px;
  height: 100%;
  padding: 1rem;
`;

const Header = styled.div`
  ${(props) => props.theme.flex.row};

  padding: 0 1rem;

  & button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${(props) => props.theme.color.sky3};
    font-weight: 550;
    font-size: 1.25rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  ${(props) => props.theme.border_box};
  padding: 1rem;
`;

const LocationCard = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border: solid 0.5px ${(props) => props.theme.color.purple};
  margin: 1rem 0;
  ${(props) => props.theme.border_box};
  ${(props) => props.theme.flex.row};
  padding: 1rem 1.5rem;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? props.theme.color.sky3 : 'white')};
  color: ${(props) => (props.isSelected ? 'white' : 'black')};
  transition: 0.3s ease;
  font-weight: bold;
  font-size: 1.25rem;
  & span.current {
    font-weight: normal;
    margin-bottom: 10px;
  }
  & svg.check {
    visibility: ${(props) => (props.isSelected ? 'visible' : 'hidden')};
    color: white;
    font-size: 2rem;
  }

  & svg.cancel {
    color: #ff3e00;
    font-size: 1.5rem;
  }

  &:hover {
    background-color: ${(props) => props.theme.color.sky3};
  }
`;

const spinnerStyle = css`
  display: block;
  position: absolute;
  top: 50%;
  margin: 0 auto;
`;

export default LocationSetting;
