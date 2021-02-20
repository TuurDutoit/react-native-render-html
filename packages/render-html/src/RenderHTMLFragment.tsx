import React from 'react';
import PropTypes from 'prop-types';
import { ResolvedResourceProps, RenderHTMLFragmentProps } from './shared-types';
import TChildrenRenderersContext from './context/TChildrenRendererContext';
import TNodeChildrenRenderer from './TNodeChildrenRenderer';
import RenderHTMLFragmentDebug from './RenderHTMLFragmentDebug';
import SourceLoader from './SourceLoader';
import TChildrenRenderer from './TChildrenRenderer';
import RenderResolvedHTML from './RenderResolvedHTML';
import SharedPropsProvider from './context/SharedPropsProvider';
import defaultSharedProps from './context/defaultSharedProps';

export type RenderHTMLFragmentPropTypes = Record<
  keyof RenderHTMLFragmentProps,
  any
>;

export const renderHtmlFragmentPropTypes: RenderHTMLFragmentPropTypes = {
  defaultTextProps: PropTypes.object,
  defaultViewProps: PropTypes.object,
  source: PropTypes.oneOfType([
    PropTypes.shape({
      html: PropTypes.string.isRequired,
      baseUrl: PropTypes.string
    }),
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
      method: PropTypes.string,
      body: PropTypes.any,
      headers: PropTypes.object
    })
  ]),
  enableExperimentalMarginCollapsing: PropTypes.bool,
  remoteErrorView: PropTypes.func,
  remoteLoadingView: PropTypes.func,
  debug: PropTypes.bool.isRequired,
  onLinkPress: PropTypes.func,
  computeEmbeddedMaxWidth: PropTypes.func,
  contentWidth: PropTypes.number,
  enableExperimentalPercentWidth: PropTypes.bool,
  imagesInitialDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  renderersProps: PropTypes.object,
  onTTreeChange: PropTypes.func,
  onHTMLLoaded: PropTypes.func,
  WebView: PropTypes.any,
  defaultWebViewProps: PropTypes.object,
  setMarkersForTNode: PropTypes.func,
  onDocumentMetadataLoaded: PropTypes.func
};

export const renderHTMLFragmentDefaultProps: {
  [k in keyof RenderHTMLFragmentProps]?: RenderHTMLFragmentProps[k];
} = {
  ...defaultSharedProps,
  contentWidth: undefined
};

const childrenRendererContext = {
  TChildrenRenderer,
  TNodeChildrenRenderer
};

/**
 * Render a HTML snippet, given that there is a `TRenderEngineProvider` up in
 * the render tree.
 *
 * @param props - Props for this component.
 *
 * @public
 */
export default function RenderHTMLFragment(props: RenderHTMLFragmentProps) {
  const {
    source,
    onHTMLLoaded,
    onTTreeChange,
    remoteErrorView,
    remoteLoadingView,
    onDocumentMetadataLoaded
  } = props;
  const sourceLoaderProps = {
    source,
    onHTMLLoaded,
    remoteErrorView,
    remoteLoadingView,
    children: (resolvedProps: ResolvedResourceProps) => (
      <RenderResolvedHTML
        {...resolvedProps}
        onDocumentMetadataLoaded={onDocumentMetadataLoaded}
        onTTreeChange={onTTreeChange}
      />
    )
  };

  return (
    <RenderHTMLFragmentDebug {...props}>
      <SharedPropsProvider {...props}>
        <TChildrenRenderersContext.Provider value={childrenRendererContext}>
          {React.createElement(SourceLoader, sourceLoaderProps)}
        </TChildrenRenderersContext.Provider>
      </SharedPropsProvider>
    </RenderHTMLFragmentDebug>
  );
}

RenderHTMLFragment.defaultProps = renderHTMLFragmentDefaultProps;
RenderHTMLFragment.propTypes = renderHtmlFragmentPropTypes;