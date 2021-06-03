'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">safe-front documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/DashboardMenuModule.html" data-type="entity-link">DashboardMenuModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SafeAccessModule.html" data-type="entity-link">SafeAccessModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeAccessModule-460805d0ec2950e257d2ff83e0809c6d"' : 'data-target="#xs-components-links-module-SafeAccessModule-460805d0ec2950e257d2ff83e0809c6d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeAccessModule-460805d0ec2950e257d2ff83e0809c6d"' :
                                            'id="xs-components-links-module-SafeAccessModule-460805d0ec2950e257d2ff83e0809c6d"' }>
                                            <li class="link">
                                                <a href="components/SafeAccessComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeAccessComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeEditAccessComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeEditAccessComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeChartModule.html" data-type="entity-link">SafeChartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeChartModule-72c2112063dd7fece040da6fb7ba36c1"' : 'data-target="#xs-components-links-module-SafeChartModule-72c2112063dd7fece040da6fb7ba36c1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeChartModule-72c2112063dd7fece040da6fb7ba36c1"' :
                                            'id="xs-components-links-module-SafeChartModule-72c2112063dd7fece040da6fb7ba36c1"' }>
                                            <li class="link">
                                                <a href="components/SafeChartComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeChartComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeChartSettingsModule.html" data-type="entity-link">SafeChartSettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeChartSettingsModule-1b0ba585f21f384fa1d81ef1c66e9a0d"' : 'data-target="#xs-components-links-module-SafeChartSettingsModule-1b0ba585f21f384fa1d81ef1c66e9a0d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeChartSettingsModule-1b0ba585f21f384fa1d81ef1c66e9a0d"' :
                                            'id="xs-components-links-module-SafeChartSettingsModule-1b0ba585f21f384fa1d81ef1c66e9a0d"' }>
                                            <li class="link">
                                                <a href="components/SafeChartSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeChartSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeChooseRecordModalModule.html" data-type="entity-link">SafeChooseRecordModalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeChooseRecordModalModule-4081bbb9fc99273a28869a758a96a47b"' : 'data-target="#xs-components-links-module-SafeChooseRecordModalModule-4081bbb9fc99273a28869a758a96a47b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeChooseRecordModalModule-4081bbb9fc99273a28869a758a96a47b"' :
                                            'id="xs-components-links-module-SafeChooseRecordModalModule-4081bbb9fc99273a28869a758a96a47b"' }>
                                            <li class="link">
                                                <a href="components/SafeChooseRecordModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeChooseRecordModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeConfirmModalModule.html" data-type="entity-link">SafeConfirmModalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeConfirmModalModule-df1ee79898a3550e451b03d5e193079a"' : 'data-target="#xs-components-links-module-SafeConfirmModalModule-df1ee79898a3550e451b03d5e193079a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeConfirmModalModule-df1ee79898a3550e451b03d5e193079a"' :
                                            'id="xs-components-links-module-SafeConfirmModalModule-df1ee79898a3550e451b03d5e193079a"' }>
                                            <li class="link">
                                                <a href="components/SafeConfirmModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeConfirmModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeConvertModalModule.html" data-type="entity-link">SafeConvertModalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeConvertModalModule-c2a363cd8c66f0cdfc3a69d338dcc749"' : 'data-target="#xs-components-links-module-SafeConvertModalModule-c2a363cd8c66f0cdfc3a69d338dcc749"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeConvertModalModule-c2a363cd8c66f0cdfc3a69d338dcc749"' :
                                            'id="xs-components-links-module-SafeConvertModalModule-c2a363cd8c66f0cdfc3a69d338dcc749"' }>
                                            <li class="link">
                                                <a href="components/SafeConvertModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeConvertModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeEditorModule.html" data-type="entity-link">SafeEditorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeEditorModule-925f6b61cb2ae4e70f6def98bae63929"' : 'data-target="#xs-components-links-module-SafeEditorModule-925f6b61cb2ae4e70f6def98bae63929"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeEditorModule-925f6b61cb2ae4e70f6def98bae63929"' :
                                            'id="xs-components-links-module-SafeEditorModule-925f6b61cb2ae4e70f6def98bae63929"' }>
                                            <li class="link">
                                                <a href="components/SafeEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeEditorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeEditorSettingsModule.html" data-type="entity-link">SafeEditorSettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeEditorSettingsModule-78e7a7500345f5609f3479ce132b5064"' : 'data-target="#xs-components-links-module-SafeEditorSettingsModule-78e7a7500345f5609f3479ce132b5064"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeEditorSettingsModule-78e7a7500345f5609f3479ce132b5064"' :
                                            'id="xs-components-links-module-SafeEditorSettingsModule-78e7a7500345f5609f3479ce132b5064"' }>
                                            <li class="link">
                                                <a href="components/SafeEditorSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeEditorSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeExpandedCommentModule.html" data-type="entity-link">SafeExpandedCommentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeExpandedCommentModule-91eb248faec7f9c4549f3f14621ea5c8"' : 'data-target="#xs-components-links-module-SafeExpandedCommentModule-91eb248faec7f9c4549f3f14621ea5c8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeExpandedCommentModule-91eb248faec7f9c4549f3f14621ea5c8"' :
                                            'id="xs-components-links-module-SafeExpandedCommentModule-91eb248faec7f9c4549f3f14621ea5c8"' }>
                                            <li class="link">
                                                <a href="components/SafeExpandedCommentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeExpandedCommentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeFormBuilderModule.html" data-type="entity-link">SafeFormBuilderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeFormBuilderModule-2cb2f86e4d0b67227476e4fb7eccf417"' : 'data-target="#xs-components-links-module-SafeFormBuilderModule-2cb2f86e4d0b67227476e4fb7eccf417"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeFormBuilderModule-2cb2f86e4d0b67227476e4fb7eccf417"' :
                                            'id="xs-components-links-module-SafeFormBuilderModule-2cb2f86e4d0b67227476e4fb7eccf417"' }>
                                            <li class="link">
                                                <a href="components/SafeFormBuilderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeFormBuilderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeFormModalModule.html" data-type="entity-link">SafeFormModalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeFormModalModule-c88610b9afb0b2224adede41308a2f11"' : 'data-target="#xs-components-links-module-SafeFormModalModule-c88610b9afb0b2224adede41308a2f11"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeFormModalModule-c88610b9afb0b2224adede41308a2f11"' :
                                            'id="xs-components-links-module-SafeFormModalModule-c88610b9afb0b2224adede41308a2f11"' }>
                                            <li class="link">
                                                <a href="components/SafeFormModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeFormModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeFormModule.html" data-type="entity-link">SafeFormModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeFormModule-06df959011a4cbb77a7235945104b731"' : 'data-target="#xs-components-links-module-SafeFormModule-06df959011a4cbb77a7235945104b731"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeFormModule-06df959011a4cbb77a7235945104b731"' :
                                            'id="xs-components-links-module-SafeFormModule-06df959011a4cbb77a7235945104b731"' }>
                                            <li class="link">
                                                <a href="components/SafeFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeFormComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeGridModule.html" data-type="entity-link">SafeGridModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeGridModule-8ee3bc2bfb5d50e35b824c0cae8bbf01"' : 'data-target="#xs-components-links-module-SafeGridModule-8ee3bc2bfb5d50e35b824c0cae8bbf01"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeGridModule-8ee3bc2bfb5d50e35b824c0cae8bbf01"' :
                                            'id="xs-components-links-module-SafeGridModule-8ee3bc2bfb5d50e35b824c0cae8bbf01"' }>
                                            <li class="link">
                                                <a href="components/SafeGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeGridComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeGridSettingsModule.html" data-type="entity-link">SafeGridSettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeGridSettingsModule-5571294e7b7aac72eb7ee1d781248a78"' : 'data-target="#xs-components-links-module-SafeGridSettingsModule-5571294e7b7aac72eb7ee1d781248a78"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeGridSettingsModule-5571294e7b7aac72eb7ee1d781248a78"' :
                                            'id="xs-components-links-module-SafeGridSettingsModule-5571294e7b7aac72eb7ee1d781248a78"' }>
                                            <li class="link">
                                                <a href="components/SafeFloatingButtonSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeFloatingButtonSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeGridSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeGridSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeLayoutModule.html" data-type="entity-link">SafeLayoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeLayoutModule-e6ff7abc66ebcecaaef456cea673767b"' : 'data-target="#xs-components-links-module-SafeLayoutModule-e6ff7abc66ebcecaaef456cea673767b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeLayoutModule-e6ff7abc66ebcecaaef456cea673767b"' :
                                            'id="xs-components-links-module-SafeLayoutModule-e6ff7abc66ebcecaaef456cea673767b"' }>
                                            <li class="link">
                                                <a href="components/SafeLayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeLayoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeMapModule.html" data-type="entity-link">SafeMapModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeMapModule-0d31f6fe3597da60a11e2ae09aa1516f"' : 'data-target="#xs-components-links-module-SafeMapModule-0d31f6fe3597da60a11e2ae09aa1516f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeMapModule-0d31f6fe3597da60a11e2ae09aa1516f"' :
                                            'id="xs-components-links-module-SafeMapModule-0d31f6fe3597da60a11e2ae09aa1516f"' }>
                                            <li class="link">
                                                <a href="components/SafeMapComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeMapComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeMapSettingsModule.html" data-type="entity-link">SafeMapSettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeMapSettingsModule-dac295a79f6c466ac4ea6ce580e2b4db"' : 'data-target="#xs-components-links-module-SafeMapSettingsModule-dac295a79f6c466ac4ea6ce580e2b4db"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeMapSettingsModule-dac295a79f6c466ac4ea6ce580e2b4db"' :
                                            'id="xs-components-links-module-SafeMapSettingsModule-dac295a79f6c466ac4ea6ce580e2b4db"' }>
                                            <li class="link">
                                                <a href="components/SafeMapSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeMapSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeModule.html" data-type="entity-link">SafeModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SafePreviousButtonModule.html" data-type="entity-link">SafePreviousButtonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafePreviousButtonModule-9d8f353ca26a6bf9346bd0058ca7d95a"' : 'data-target="#xs-components-links-module-SafePreviousButtonModule-9d8f353ca26a6bf9346bd0058ca7d95a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafePreviousButtonModule-9d8f353ca26a6bf9346bd0058ca7d95a"' :
                                            'id="xs-components-links-module-SafePreviousButtonModule-9d8f353ca26a6bf9346bd0058ca7d95a"' }>
                                            <li class="link">
                                                <a href="components/SafePreviousButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafePreviousButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeProfileModule.html" data-type="entity-link">SafeProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeProfileModule-4f877ec75d2f9d2c989f737d79b1b8cc"' : 'data-target="#xs-components-links-module-SafeProfileModule-4f877ec75d2f9d2c989f737d79b1b8cc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeProfileModule-4f877ec75d2f9d2c989f737d79b1b8cc"' :
                                            'id="xs-components-links-module-SafeProfileModule-4f877ec75d2f9d2c989f737d79b1b8cc"' }>
                                            <li class="link">
                                                <a href="components/SafeProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeProfileComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeQueryBuilderModule.html" data-type="entity-link">SafeQueryBuilderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeQueryBuilderModule-ed35f45f0bf9b25369456522afd1831c"' : 'data-target="#xs-components-links-module-SafeQueryBuilderModule-ed35f45f0bf9b25369456522afd1831c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeQueryBuilderModule-ed35f45f0bf9b25369456522afd1831c"' :
                                            'id="xs-components-links-module-SafeQueryBuilderModule-ed35f45f0bf9b25369456522afd1831c"' }>
                                            <li class="link">
                                                <a href="components/SafeQueryBuilderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeQueryBuilderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeTabFieldsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeTabFieldsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeTabFilterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeTabFilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeTabSortComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeTabSortComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeRecordHistoryModule.html" data-type="entity-link">SafeRecordHistoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeRecordHistoryModule-305774676daa68646a2d38bb8201f372"' : 'data-target="#xs-components-links-module-SafeRecordHistoryModule-305774676daa68646a2d38bb8201f372"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeRecordHistoryModule-305774676daa68646a2d38bb8201f372"' :
                                            'id="xs-components-links-module-SafeRecordHistoryModule-305774676daa68646a2d38bb8201f372"' }>
                                            <li class="link">
                                                <a href="components/SafeRecordHistoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeRecordHistoryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeRecordModalModule.html" data-type="entity-link">SafeRecordModalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeRecordModalModule-3c05d3e9f747ffcda2382a3dd31fdc8a"' : 'data-target="#xs-components-links-module-SafeRecordModalModule-3c05d3e9f747ffcda2382a3dd31fdc8a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeRecordModalModule-3c05d3e9f747ffcda2382a3dd31fdc8a"' :
                                            'id="xs-components-links-module-SafeRecordModalModule-3c05d3e9f747ffcda2382a3dd31fdc8a"' }>
                                            <li class="link">
                                                <a href="components/SafeRecordModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeRecordModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeRolesModule.html" data-type="entity-link">SafeRolesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeRolesModule-9b025a763ac595a311678764b2f12003"' : 'data-target="#xs-components-links-module-SafeRolesModule-9b025a763ac595a311678764b2f12003"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeRolesModule-9b025a763ac595a311678764b2f12003"' :
                                            'id="xs-components-links-module-SafeRolesModule-9b025a763ac595a311678764b2f12003"' }>
                                            <li class="link">
                                                <a href="components/SafeAddRoleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeAddRoleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeEditRoleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeEditRoleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeRolesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeRolesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeSchedulerModule.html" data-type="entity-link">SafeSchedulerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeSchedulerModule-94dcbdf7a36fde3abffe4a10b81cddf8"' : 'data-target="#xs-components-links-module-SafeSchedulerModule-94dcbdf7a36fde3abffe4a10b81cddf8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeSchedulerModule-94dcbdf7a36fde3abffe4a10b81cddf8"' :
                                            'id="xs-components-links-module-SafeSchedulerModule-94dcbdf7a36fde3abffe4a10b81cddf8"' }>
                                            <li class="link">
                                                <a href="components/SafeSchedulerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeSchedulerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeSchedulerSettingsModule.html" data-type="entity-link">SafeSchedulerSettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeSchedulerSettingsModule-ffce4e94aa165866e4f0204c8ee296ce"' : 'data-target="#xs-components-links-module-SafeSchedulerSettingsModule-ffce4e94aa165866e4f0204c8ee296ce"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeSchedulerSettingsModule-ffce4e94aa165866e4f0204c8ee296ce"' :
                                            'id="xs-components-links-module-SafeSchedulerSettingsModule-ffce4e94aa165866e4f0204c8ee296ce"' }>
                                            <li class="link">
                                                <a href="components/SafeSchedulerSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeSchedulerSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeStatusModalModule.html" data-type="entity-link">SafeStatusModalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeStatusModalModule-28a14013d117c6c12a77e6de694ce1a4"' : 'data-target="#xs-components-links-module-SafeStatusModalModule-28a14013d117c6c12a77e6de694ce1a4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeStatusModalModule-28a14013d117c6c12a77e6de694ce1a4"' :
                                            'id="xs-components-links-module-SafeStatusModalModule-28a14013d117c6c12a77e6de694ce1a4"' }>
                                            <li class="link">
                                                <a href="components/SafeStatusModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeStatusModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeSurveyGridModule.html" data-type="entity-link">SafeSurveyGridModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeSurveyGridModule-74257a0418d1ab54befdc1003065286a"' : 'data-target="#xs-components-links-module-SafeSurveyGridModule-74257a0418d1ab54befdc1003065286a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeSurveyGridModule-74257a0418d1ab54befdc1003065286a"' :
                                            'id="xs-components-links-module-SafeSurveyGridModule-74257a0418d1ab54befdc1003065286a"' }>
                                            <li class="link">
                                                <a href="components/SafeSurveyGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeSurveyGridComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeUsersModule.html" data-type="entity-link">SafeUsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeUsersModule-56badf4b29cb5ea5d879d6f80ba107f3"' : 'data-target="#xs-components-links-module-SafeUsersModule-56badf4b29cb5ea5d879d6f80ba107f3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeUsersModule-56badf4b29cb5ea5d879d6f80ba107f3"' :
                                            'id="xs-components-links-module-SafeUsersModule-56badf4b29cb5ea5d879d6f80ba107f3"' }>
                                            <li class="link">
                                                <a href="components/SafeEditUserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeEditUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeInviteUserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeInviteUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeUsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeUsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeWidgetGridModule.html" data-type="entity-link">SafeWidgetGridModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeWidgetGridModule-afd963fbaa3ce0b1fdd08ae1ae498e48"' : 'data-target="#xs-components-links-module-SafeWidgetGridModule-afd963fbaa3ce0b1fdd08ae1ae498e48"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeWidgetGridModule-afd963fbaa3ce0b1fdd08ae1ae498e48"' :
                                            'id="xs-components-links-module-SafeWidgetGridModule-afd963fbaa3ce0b1fdd08ae1ae498e48"' }>
                                            <li class="link">
                                                <a href="components/SafeDashboardMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeDashboardMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeExpandedWidgetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeExpandedWidgetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeFloatingOptionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeFloatingOptionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeTileDataComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeTileDataComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeTileDisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeTileDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SafeWidgetGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeWidgetGridComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SafeWidgetModule.html" data-type="entity-link">SafeWidgetModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SafeWidgetModule-90275b2e681319d167ad991e4fe5e5f7"' : 'data-target="#xs-components-links-module-SafeWidgetModule-90275b2e681319d167ad991e4fe5e5f7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SafeWidgetModule-90275b2e681319d167ad991e4fe5e5f7"' :
                                            'id="xs-components-links-module-SafeWidgetModule-90275b2e681319d167ad991e4fe5e5f7"' }>
                                            <li class="link">
                                                <a href="components/SafeWidgetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeWidgetComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Chart.html" data-type="entity-link">Chart</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionsManagement.html" data-type="entity-link">PermissionsManagement</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pie.html" data-type="entity-link">Pie</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AggregationBuilderService.html" data-type="entity-link">AggregationBuilderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DomService.html" data-type="entity-link">DomService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QueryBuilderService.html" data-type="entity-link">QueryBuilderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeApplicationService.html" data-type="entity-link">SafeApplicationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeAuthService.html" data-type="entity-link">SafeAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeDownloadService.html" data-type="entity-link">SafeDownloadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeFormService.html" data-type="entity-link">SafeFormService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeGridService.html" data-type="entity-link">SafeGridService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeLayoutService.html" data-type="entity-link">SafeLayoutService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeNotificationService.html" data-type="entity-link">SafeNotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeSnackBarService.html" data-type="entity-link">SafeSnackBarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SafeWorkflowService.html" data-type="entity-link">SafeWorkflowService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/SafePermissionGuard.html" data-type="entity-link">SafePermissionGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddChannelMutationResponse.html" data-type="entity-link">AddChannelMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddPageMutationResponse.html" data-type="entity-link">AddPageMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddPositionAttributeCategoryMutationResponse.html" data-type="entity-link">AddPositionAttributeCategoryMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddRecordMutationResponse.html" data-type="entity-link">AddRecordMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddRoleMutationResponse.html" data-type="entity-link">AddRoleMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddRoleToUsersMutationResponse.html" data-type="entity-link">AddRoleToUsersMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddStepMutationResponse.html" data-type="entity-link">AddStepMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddSubscriptionMutationResponse.html" data-type="entity-link">AddSubscriptionMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Application.html" data-type="entity-link">Application</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Channel.html" data-type="entity-link">Channel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConvertRecordMutationResponse.html" data-type="entity-link">ConvertRecordMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dashboard.html" data-type="entity-link">Dashboard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteChannelMutationResponse.html" data-type="entity-link">DeleteChannelMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeletePageMutationResponse.html" data-type="entity-link">DeletePageMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeletePositionAttributeCategoryMutationResponse.html" data-type="entity-link">DeletePositionAttributeCategoryMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteRecordMutationResponse.html" data-type="entity-link">DeleteRecordMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteRoleMutationResponse.html" data-type="entity-link">DeleteRoleMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteSubscriptionMutationResponse.html" data-type="entity-link">DeleteSubscriptionMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteUsersFromApplicationMutationResponse.html" data-type="entity-link">DeleteUsersFromApplicationMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteUsersMutationResponse.html" data-type="entity-link">DeleteUsersMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditApplicationMutationResponse.html" data-type="entity-link">EditApplicationMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditFormMutationResponse.html" data-type="entity-link">EditFormMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditPositionAttributeCategoryMutationResponse.html" data-type="entity-link">EditPositionAttributeCategoryMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditRecordMutationResponse.html" data-type="entity-link">EditRecordMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditRoleMutationResponse.html" data-type="entity-link">EditRoleMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditSubscriptionMutationResponse.html" data-type="entity-link">EditSubscriptionMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditUserMutationResponse.html" data-type="entity-link">EditUserMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditUserProfileMutationResponse.html" data-type="entity-link">EditUserProfileMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Form.html" data-type="entity-link">Form</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetApplicationByIdQueryResponse.html" data-type="entity-link">GetApplicationByIdQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetChannelsQueryResponse.html" data-type="entity-link">GetChannelsQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetFormByIdQueryResponse.html" data-type="entity-link">GetFormByIdQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetFormsQueryResponse.html" data-type="entity-link">GetFormsQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetNotificationsQueryResponse.html" data-type="entity-link">GetNotificationsQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetPermissionsQueryResponse.html" data-type="entity-link">GetPermissionsQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetProfileQueryResponse.html" data-type="entity-link">GetProfileQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetQueryTypes.html" data-type="entity-link">GetQueryTypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetRecordByIdQueryResponse.html" data-type="entity-link">GetRecordByIdQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetRecordDetailsQueryResponse.html" data-type="entity-link">GetRecordDetailsQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetRelatedFormsQueryResponse.html" data-type="entity-link">GetRelatedFormsQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetResourceByIdQueryResponse.html" data-type="entity-link">GetResourceByIdQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetResourcesQueryResponse.html" data-type="entity-link">GetResourcesQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetRolesQueryResponse.html" data-type="entity-link">GetRolesQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetType.html" data-type="entity-link">GetType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetUsersQueryResponse.html" data-type="entity-link">GetUsersQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetWorkflowByIdQueryResponse.html" data-type="entity-link">GetWorkflowByIdQueryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationSubscriptionResponse.html" data-type="entity-link">NotificationSubscriptionResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Page.html" data-type="entity-link">Page</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Permission.html" data-type="entity-link">Permission</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PositionAttribute.html" data-type="entity-link">PositionAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PositionAttributeCategory.html" data-type="entity-link">PositionAttributeCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PublishMutationResponse.html" data-type="entity-link">PublishMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PublishNotificationMutationResponse.html" data-type="entity-link">PublishNotificationMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Record.html" data-type="entity-link">Record</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecordAddedSubscriptionResponse.html" data-type="entity-link">RecordAddedSubscriptionResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Resource.html" data-type="entity-link">Resource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Role.html" data-type="entity-link">Role</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SeeNotificationMutationResponse.html" data-type="entity-link">SeeNotificationMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SeeNotificationsMutationResponse.html" data-type="entity-link">SeeNotificationsMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusDialogData.html" data-type="entity-link">StatusDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Step.html" data-type="entity-link">Step</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subscription.html" data-type="entity-link">Subscription</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadFileMutationResponse.html" data-type="entity-link">UploadFileMutationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Version.html" data-type="entity-link">Version</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Version-1.html" data-type="entity-link">Version</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Workflow.html" data-type="entity-link">Workflow</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});