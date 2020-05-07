/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import SideMenu from './SideMenu.js';
import Header from './Header.js';
import Navigation from './Navigation.js';
import NavigationCategory from './NavigationCategory.js';
import NavigationLink from './NavigationLink.js';
import Footer from './Footer.js';

SideMenu.Header = Header;
SideMenu.Navigation = Navigation;
SideMenu.NavigationCategory = NavigationCategory;
SideMenu.NavigationLink = NavigationLink;
SideMenu.Footer = Footer;

export default SideMenu;
