import { css, type RuleSet } from 'styled-components';
import { theme } from './theme';

type Interpolations = Parameters<typeof css>;

// Usage: ${media.mobile`display: none;`}
export const media = {
  mobile: (...args: Interpolations): RuleSet =>
    css`
      @media (max-width: ${theme.breakpoints.mobile}) {
        ${css(...args)}
      }
    `,
  tablet: (...args: Interpolations): RuleSet =>
    css`
      @media (min-width: calc(${theme.breakpoints.mobile} + 1px)) and (max-width: ${theme.breakpoints.tablet}) {
        ${css(...args)}
      }
    `,
  tabletDown: (...args: Interpolations): RuleSet =>
    css`
      @media (max-width: ${theme.breakpoints.tablet}) {
        ${css(...args)}
      }
    `,
  desktop: (...args: Interpolations): RuleSet =>
    css`
      @media (min-width: calc(${theme.breakpoints.tablet} + 1px)) {
        ${css(...args)}
      }
    `,
};
