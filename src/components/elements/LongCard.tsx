import React, { Fragment } from 'react';

import styled from 'styled-components';

// elements
import { Grid, Icon } from './index';

type LongCardType = {
  height?: string;
  day: string;
  data: any;
  type: string;
  isFirst?: boolean;
};

const LongCard = (props: LongCardType) => {
  const { height, day, data, type, isFirst } = props;
  const style = {
    height,
    isFirst,
  };

  const unit = {
    humidity: '%',
    rainPer: '%',
    windSpeed: 'm/s',
  };

  return (
    <ElLongCard {...style}>
      <Grid width="30%">
        <Text>{day}</Text>
      </Grid>
      <Icon name="setting" />
      {/* data 내용 */}
      {type !== 'tmp' && type !== 'weather' && (
        <Grid width="30%">
          <Text>
            {data}
            {unit[type]}
          </Text>
        </Grid>
      )}
      {type === 'weather' && (
        <>
          <Icon name="main" />
          {data.weather}
          <Temp>
            <Grid isColumn>
              <TempText max="true">{data.max}</TempText>
              <TempText>{data.min}</TempText>
            </Grid>
            <Text>{data.tmp}</Text>
          </Temp>
        </>
      )}
    </ElLongCard>
  );
};

LongCard.defaultProps = {
  height: '10%',
  isFirst: false,
};

const ElLongCard = styled.div<LongCardType>`
  ${(props) => props.theme.flex.row};
  justify-content: space-between;
  width: 100%;
  padding: 1rem 3rem;
  height: ${(props) => (props.isFirst ? `12%` : props.height)};
  border-radius: 14px;
  ${(props) => props.theme.shadow};
  border: solid 0.5px ${(props) => props.theme.color.purple};
  background-color: white;
`;

const Text = styled.div`
  width: 80px;
  text-align: center;
`;

const Temp = styled.div`
  ${(props) => props.theme.flex.row};
  width: 100px;
`;

const TempText = styled.span<{ max?: boolean }>`
  color: ${(props) => (props.max ? props.theme.color.veryBad : props.theme.color.usually)};
`;

export default LongCard;
