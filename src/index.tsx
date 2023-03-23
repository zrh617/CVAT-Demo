import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link } from "react-router-dom";
import { connect, Provider } from 'react-redux';
import createCVATStore, { getCVATStore } from '@/store';
import { CombinedState, NotificationsState } from './reducers';
import { getFormatsAsync } from '@/actions/formats-actions';
import createRootReducer from '@/reducers/root-reducer';
import { KeyMap } from '@/utils/mousetrap-react';
import ProCard from '@ant-design/pro-card';
import type { ProSettings } from '@ant-design/pro-layout';
import { PageContainer, ProLayout } from '@ant-design/pro-layout';
import App from "./app";
import defaultProps from './_defaultProps';

createCVATStore(createRootReducer);
const cvatStore = getCVATStore();
const ReduxAppWrapper = connect(mapStateToProps, mapDispatchToProps)(App);

interface StateToProps {
  pluginsInitialized: boolean;
  pluginsFetching: boolean;
  modelsInitialized: boolean;
  modelsFetching: boolean;
  userInitialized: boolean;
  userFetching: boolean;
  organizationsFetching: boolean;
  organizationsInitialized: boolean;
  aboutInitialized: boolean;
  aboutFetching: boolean;
  formatsInitialized: boolean;
  formatsFetching: boolean;
  userAgreementsInitialized: boolean;
  userAgreementsFetching: boolean;
  authActionsFetching: boolean;
  authActionsInitialized: boolean;
  allowChangePassword: boolean;
  allowResetPassword: boolean;
  notifications: NotificationsState;
  user: any;
  // keyMap: KeyMap;
  // isModelPluginActive: boolean;
}

interface DispatchToProps {
  loadFormats: () => void;
  // verifyAuthorized: () => void;
  // loadAbout: () => void;
  // initModels: () => void;
  // initPlugins: () => void;
  // resetErrors: () => void;
  // resetMessages: () => void;
  // switchShortcutsDialog: () => void;
  // loadUserAgreements: () => void;
  // switchSettingsDialog: () => void;
  // loadAuthActions: () => void;
  // loadOrganizations: () => void;
}

// function mapStateToProps(state: CombinedState): StateToProps {
function mapStateToProps(state: CombinedState) {
  const { plugins } = state;
  const { auth } = state;
  const { formats } = state;
  const { about } = state;
  const { shortcuts } = state;
  const { userAgreements } = state;
  const { models } = state;
  const { organizations } = state;

  return {
    userInitialized: auth.initialized,
    userFetching: auth.fetching,
    // organizationsFetching: organizations.fetching,
    // organizationsInitialized: organizations.initialized,
    // pluginsInitialized: plugins.initialized,
    // pluginsFetching: plugins.fetching,
    // modelsInitialized: models.initialized,
    // modelsFetching: models.fetching,
    // aboutInitialized: about.initialized,
    // aboutFetching: about.fetching,
    // formatsInitialized: formats.initialized,
    // formatsFetching: formats.fetching,
    // userAgreementsInitialized: userAgreements.initialized,
    // userAgreementsFetching: userAgreements.fetching,
    authActionsFetching: auth.authActionsFetching,
    authActionsInitialized: auth.authActionsInitialized,
    allowChangePassword: auth.allowChangePassword,
    allowResetPassword: auth.allowResetPassword,
    // notifications: state.notifications,
    user: auth.user,
    // keyMap: shortcuts.keyMap,
    // isModelPluginActive: plugins.list.MODELS,
  };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
  return {
    loadFormats: (): void => dispatch(getFormatsAsync()),
    // verifyAuthorized: (): void => dispatch(authorizedAsync()),
    // loadUserAgreements: (): void => dispatch(getUserAgreementsAsync()),
    // initPlugins: (): void => dispatch(getPluginsAsync()),
    // initModels: (): void => dispatch(getModelsAsync()),
    // loadAbout: (): void => dispatch(getAboutAsync()),
    // resetErrors: (): void => dispatch(resetErrors()),
    // resetMessages: (): void => dispatch(resetMessages()),
    // switchShortcutsDialog: (): void => dispatch(shortcutsActions.switchShortcutsDialog()),
    // switchSettingsDialog: (): void => dispatch(switchSettingsDialog()),
    // loadAuthActions: (): void => dispatch(loadAuthActionsAsync()),
    // loadOrganizations: (): void => dispatch(getOrganizationsAsync()),
  };
}

function render() {
  const root = createRoot(document.getElementById('root')!)
  const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
  };

  root.render(
    <Provider store={cvatStore}>
      <BrowserRouter>
        <div
          id="pro-layout"
          style={{
            height: '100vh',
          }}
        >
          <ProLayout
            bgLayoutImgList={[
              {
                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                left: 85,
                bottom: 100,
                height: '303px',
              },
              {
                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                bottom: -68,
                right: -45,
                height: '303px',
              },
              {
                src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                bottom: 0,
                left: 0,
                width: '331px',
              },
            ]}
            {...defaultProps}
            title={false}
            logo={false}
            menu={{
              type: 'group',
            }}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: 'robot',
            }}
            menuHeaderRender={(logo, title) => {
              const defaultDom = (
                <Link to="">CVAT Platform</Link> 
              );
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              return (
                <>
                  {defaultDom}
                </>
              );
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              return [
                <div></div>,
              ];
            }}
            {...settings}
          >
            <PageContainer>
              <ProCard
                style={{
                  height: '100vh',
                  minHeight: 800,
                }}
              >
                <ReduxAppWrapper />
              </ProCard>
            </PageContainer>
          </ProLayout>
        </div>
      </BrowserRouter>
    </Provider >
  )
}

render()