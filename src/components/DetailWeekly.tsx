import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/modules'
import { timeActions } from 'src/redux/modules/time'
import styled from 'styled-components'
import { weatherActions } from 'src/redux/modules/weather'

import { LongCard } from './elements'
import TimeInfo from './TimeInfo'

const DetailWeekly = props => {
    const {category} = props
    const dispatch = useDispatch()
    const dayOfWeek = useSelector((state: RootState) => state.time.dayOfWeek);
    const weekInfo = useSelector((state: RootState) => state.weather.weatherInfo?.weekInfo)
      
    
    const {humidity,maxTmp,minTmp,rainPer,tmp,weather,weatherDes,windSpeed} = weekInfo

    // temp정보

    // 날씨정보

    // 나머지    
    const Content = weekInfo?.[category]?.map((data,idx)=>{        
        
        return <LongCard key={idx} day={dayOfWeek?.[idx]} data={data} />
    }) 

    const title = {
        tmp:'기온',
        weather:'날씨',
        humidity:'습도',
        rainPer:'강수확률',
        windSpeed:'바람'
    }



   
    return (
        <Container>
            <Title>{title[category]}</Title>
            <Contents>
                {Content}
            </Contents>
            
            {/* <Contents>                
                <TimeInfo
                    info={humidity}
                    label="습도"
                    dayOfWeek={dayOfWeek}
                    score
                />
                <TimeInfo
                    info={weather}
                    label="날씨"
                    dayOfWeek={dayOfWeek}
                    score
                />
                <TimeInfo
                    info={rainPer}
                    label="강수확률"
                    dayOfWeek={dayOfWeek}
                    score
                />
                <TimeInfo
                    info={windSpeed}
                    label="풍속"
                    dayOfWeek={dayOfWeek}
                    score
                /> 
            </Contents> */}
        </Container>
    )
}
const Container = styled.div`
    width:100%;
    height:100%;    
    ${props=>props.theme.flex.column};

  
`

const Title = styled.div`
    font-size:2rem;
`

const Contents = styled.div`
    width:100%;
    height:100%;    
    ${props=>props.theme.flex.column};

    &:nth-child(1){
        background-color:yellow
    }
`

const Card = styled.div`
      
`
export default DetailWeekly
