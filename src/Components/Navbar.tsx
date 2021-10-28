import {Affix, Space, Button, Avatar, message} from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router';
export default function Navbar()
{

    const NavigationBar = styled.div`
    width: 100vw;
    height: 10vh;
    display: flex;
    position: sticky;
    top: 0px;
    padding-inline: 1vw;
    background-color: #120338;
    justify-content: space-between;
    align-items: center;
  `;
    const history = useHistory();
    const logout = () => {
      localStorage.removeItem('authToken')
      message.info('Logout Success!')
      history.push('/login')
    }

    return(
        <Affix offsetTop={0}>
        <NavigationBar>
          <Space>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <Button type='link' onClick={() => history.push('/notes')}>Home</Button>
          <Button type='link'>About</Button>
          <Button type='link'>Contact Us</Button>
          </Space>

          <Space>
          <Button type='link' onClick={logout}>Log Out</Button>
          <Button type='link'>Login</Button>
          </Space>

        </NavigationBar>
      </Affix>
    );
}