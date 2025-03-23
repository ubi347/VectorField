import { extensions, AccessibilitySystem, Container, accessibilityTarget, EventSystem, FederatedContainer } from '../pixijs.js';
import './init-60ffbdee.js';

extensions.add(AccessibilitySystem);
extensions.mixin(Container, accessibilityTarget);

extensions.add(EventSystem);
extensions.mixin(Container, FederatedContainer);
