import { BaseLit, html, css } from './base-element'
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings'
import { installMediaQueryWatcher } from 'pwa-helpers/media-query'
import { installOfflineWatcher } from 'pwa-helpers/network'
import { installRouter } from 'pwa-helpers/router'
import { updateMetadata } from 'pwa-helpers/metadata'

import '@polymer/app-layout/app-drawer/app-drawer'
import '@polymer/app-layout/app-header/app-header'
import '@polymer/app-layout/app-scroll-effects/effects/waterfall'
import '@polymer/app-layout/app-toolbar/app-toolbar'
import '@polymer/paper-styles/paper-styles'
import '@polymer/paper-input/paper-input'
import { menuIcon } from './style-helpers/my-icons'
import './snack-bar'
import { MainSharedStyle, DividerStyle } from './style-helpers/shared-styles'

class CompiApp extends BaseLit {
  static get properties () {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _snackbarMessage: { type: String }
    }
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;

          --dark-primary-color:         #0097A7;
          --default-primary-color:      #00BCD4;
          --light-primary-color:        #B2EBF2; /*#9be7ff; */
          --light-secondary-color:      #e4f2ff;
          --text-primary-color:         #FFFFFF;
          --accent-color:               #009688; /*#03A9F4; */
          --primary-background-color:   #F7FFFE; /*#BBDEFB; */
          --secondary-background-color: #FFFFFF;
          --primary-text-color:         #004467;
          --secondary-text-color:       #757575; /*#075784; */
          --ternary-text-color:         #075784;
          --disabled-text-color:        #BDBDBD;
          --divider-color:              #BDBDBD;
          --disabled-color:             #646464;

          --shadow-box-8dp-custom : rgba(4, 68, 109, 0.14) 0px 8px 10px 1px, rgba(4, 68, 109, 0.12) 0px 3px 14px 2px, rgba(4, 68, 109, 0.4) 0px 5px 5px -3px;
          --shadow-box-4dp-custom : rgba(4, 68, 109, 0.28) 0px 3px 4px 0px, rgba(4, 68, 109, 0.24) 0px 1px 8px 0px, rgba(4, 68, 109, 0.8) 0px 3px 3px -2px;
          --shadow-box-2dp-custom : 0 3px 4px 0 rgba(4, 68, 109, 0.14), 0 1px 8px 0 rgba(4, 68, 109, 0.12), 0 3px 3px -2px rgba(4, 68, 109, 0.4);


          --app-drawer-width: 256px;

          --app-primary-color: #00BCD4;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909C;

          font-size: 12px;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 120;
          text-align: center;
          background-color: var(--default-primary-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--dark-primary-color);
          color: white;
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--accent-color);
          border-bottom: 4px solid var(--accent-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          max-height: 100vh;
          overflow: auto;
          position: relative;
          z-index: 130;
          height: calc(100vh - 64px);
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }
          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            padding-right: 0px;
          }
        }

        custom-absolute-container{
            width: 50px;
            display: inline-block;
            border-radius: 5px;
            z-index: 150;
            margin-left: 92.5%;
            position: fixed;


            --paper-input-container-color:       white;
            --paper-input-container-focus-color: white;
            --paper-input-container-input-color: white;

        }
      `,
      MainSharedStyle,
      DividerStyle
    ]
  }

  render () {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>${this.appTitle}</div>
        </app-toolbar>

      </app-header>

      <!-- Main content -->
      <main role="main" class="main-content" id="main-content">
        <primary-view class="page" ?active="${this._page === 'primary'}"></primary-view>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      </main>

      <snack-bar ?active="${this._snackbarOpened}">
        ${this._snackbarMessage}
      </snack-bar>
    `
  }

  constructor () {
    super()
    this._drawerOpened = false
    setPassiveTouchGestures(true)
  }

  firstUpdated () {
    installRouter((location) => this._locationChanged(location))
    installOfflineWatcher((offline) => this._offlineChanged(offline))
    installMediaQueryWatcher('(min-width: 460px)',
      (matches) => this._layoutChanged(matches))
    window.addEventListener('snackbar-message', (e) => {
      this._snackbarMessage = e.detail
      this._showSnackBar()
    })
  }

  updated (changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page
      updateMetadata({
        title: pageTitle,
        description: pageTitle
      })
    }
  }

  _layoutChanged (isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false)
  }

  _offlineChanged (offline) {
    const previousOffline = this._offline
    this._offline = offline

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return
    }

    clearTimeout(this.__snackbarTimer)
    this._snackbarOpened = true
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000)
  }

  _showSnackBar () {
    clearTimeout(this.__snackbarTimer)
    this._snackbarOpened = true
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000)
  }

  _locationChanged (location) {
    const path = window.decodeURIComponent(location.pathname)
    const page = path === '/' ? 'primary' : path.slice(1)
    this._loadPage(page)
    this._updateDrawerState(false)
  }

  _updateDrawerState (opened) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened
    }
  }

  _loadPage (page) {
    switch (page) {
      case 'primary':
        page = 'primary'
        import('../components/views/primary-view')
        break
      default:
        page = 'view404'
        import('../components/views/my-view404')
        break
    }

    this._page = page
  }

  _menuButtonClicked () {
    this._updateDrawerState(true)
  }

  _drawerOpenedChanged (e) {
    this._updateDrawerState(e.target.opened)
  }
}

window.customElements.define('compi-app', CompiApp)
