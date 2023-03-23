import React from 'react';
import CVATApplication from '@/pages/CVATApplication/index';
import { withRouter } from '@/utils/withRouter';
import MainPage from '@/pages/project-page';

class Home extends React.PureComponent<any> {
  constructor(props){
    super(props)
    this.jump=this.jump.bind(this);
}

  jump() {
    this.props.router.navigate('/projects')
  }

  render(): React.ReactNode {
    return (
      <MainPage />
    )
  }
};

export default withRouter(Home);