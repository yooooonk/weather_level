import React, { useEffect } from 'react';
import styled from 'styled-components';

function AppLayout(props) {
  const { children } = props
  useEffect(() => {
    // 가로모드 감지, 경고창
    window.addEventListener(
      'orientationchange',
      function () {
        if (window.orientation === -90 || window.orientation === 90) {
          if (window.innerWidth > 375) {
            return;
          }
          window.alert(
            '이 웹사이트는 세로모드를 권장합니다. 세로모드로 전환해주세요 🙏'
          );
        }
      },
      false
    );

  }, []);
  return (
    <Container>
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.color.main};
`;


export default AppLayout;