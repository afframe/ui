/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, icons from @afframe/ui icons, IBM's stable Tearsheet rewritten onto the Tearsheet from @afframe/ui (IBM's preview__Tearsheet: title in Tearsheet.HeaderContent, navigation in Tearsheet.NavigationBar, influencer in Tearsheet.Influencer, content in Tearsheet.MainContent, closeIconDescription on Tearsheet.Header), the pkg flag and the commented IBM CSS import dropped, the Labs prefix as the 'clabs' literal, typed refs for the Toc and ViewStack handles and typed ViewStack callbacks, ScrollGradient cast to a props type (IBM types it ref-only), story styles converted from SCSS to plain CSS, source tag, the Latest highlights sections at level 3 under the Tearsheet h2 title (heading-order), the listitem a11y rule disabled (Labs TocList), a play function that opens the Tearsheet, the example images replaced by a local Afframe illustration. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import {
  useCallback,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Close, Gift, Launch, Notification } from '../../icons.js';
import {
  Bubble,
  BubbleHeader,
  Button,
  ContentSwitcher,
  Heading,
  Link,
  ScrollGradient as IbmScrollGradient,
  Section,
  Switch,
  Tag,
  Tearsheet,
  Toc,
  TocItem,
  TocList,
  TocSection,
  TocSections,
  View,
  ViewStack,
} from '../../index.js';
import mdx from './WhatsNew.mdx';
import './whats-new-story.css';

// The Labs Toc and ViewStack expose these methods through their refs.
type TocHandle = { reset: () => void };
type ViewStackHandle = { back: () => void; next: () => void };

// IBM types ScrollGradient as ref-only.
const ScrollGradient = IbmScrollGradient as ComponentType<{
  children?: ReactNode;
}>;

export default {
  title: 'Patterns/WhatsNew',
  tags: ['labs'],
  subcomponents: {
    TocList,
    TocItem,
    TocSections,
    TocSection,
    Bubble,
    BubbleHeader,
    ViewStack,
    View,
  },
  parameters: {
    docs: {
      page: mdx,
      defaultName: 'Overview+',
    },
  },
} satisfies Meta;

/**
 * Default story for WhatsNew
 */
export const WhatsNewPattern: StoryFn = () => {
  /* ************************************* */
  // INTERNAL STATE
  const [contentIndex, setContentIndex] = useState(0);
  const [currentReleaseNotifications, setCurrentReleaseNotifications] =
    useState(0);
  const [totalReleaseNotifications, setTotalReleaseNotifications] = useState(0);
  const [shouldShowReleaseNotification, setShouldShowReleaseNotification] =
    useState(false);
  const [shouldShowAnnouncement, setShouldShowAnnouncement] = useState(false);
  /* ************************************* */
  // REFS
  const tocRef = useRef<TocHandle>(null);
  const viewStackRef = useRef<ViewStackHandle>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  /* ************************************* */

  /* ************************************* */
  // CONSTANTS
  const prefix = 'clabs--whats-new';
  /* ************************************* */

  /* ************************************* */
  // CALL BACKS
  const handleContentSwitch = useCallback((value: number | undefined) => {
    const cleanVal = value ? value : 0;
    setContentIndex(cleanVal);
  }, []);
  /* ************************************* */

  /* ************************************* */
  // EFFECTS
  /* ************************************* */

  return (
    <div ref={bodyRef} className="storyBody">
      {/* Storybook only control - todo:  */}
      <div className="controlHeader">
        <Button onClick={() => setShouldShowAnnouncement(true)}>
          Open What&apos;s New center
        </Button>

        <Button
          onClick={() => setShouldShowReleaseNotification((prev) => !prev)}>
          Toggle release notification
        </Button>
        <div className="iconBtnRight">
          <Button
            id="ExampleTarget"
            renderIcon={Notification}
            iconDescription="Example icon button"
            hasIconOnly
            tooltipAlignment="end"
            tooltipPosition="bottom"
          />
        </div>
      </div>
      {/* Tier 2 - release notification pattern */}
      <Bubble
        highContrast
        align="bottom-end"
        open={shouldShowReleaseNotification}
        target="#ExampleTarget">
        <BubbleHeader>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Close}
            iconDescription="Close"
            hasIconOnly
            onClick={() => {
              setShouldShowReleaseNotification(false);
            }}
          />
        </BubbleHeader>
        <ViewStack
          ref={viewStackRef}
          className={`${prefix}__wn_pattern__bubble_viewstack`}
          ariaLabel="Test view stack"
          viewAssistiveTranslator={(currentIndex: number, lastIndex: number) =>
            `Affichage de la vue ${currentIndex} sur ${lastIndex}`
          }
          onViewChangeEnd={({
            currentIndex,
            lastIndex,
          }: {
            currentIndex: number;
            lastIndex: number;
          }) => {
            setCurrentReleaseNotifications(currentIndex + 1);
            setTotalReleaseNotifications(lastIndex + 1);
          }}>
          <View title="Example View 1">
            <ScrollGradient>
              <img
                alt=""
                className={`${prefix}__wn_pattern__bubble_viewstack-view-image`}
                src="/whats-new-feature.svg"
              />
              <div
                className={`${prefix}__wn_pattern__bubble_viewstack-view-info`}>
                <Gift size={20} />
                <span>New!</span>
              </div>
              <div className={`${prefix}__wn_pattern__tag_container`}>
                <Tag
                  className="some-class"
                  size="md"
                  title="Clear filter"
                  type="purple">
                  Tag content
                </Tag>
              </div>
              <Heading
                className={`${prefix}__wn_pattern__bubble_viewstack-view-heading`}>
                Feature 1
              </Heading>
              <div
                className={`${prefix}__wn_pattern__bubble_viewstack-view-description`}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas consequat, nulla in laoreet molestie, metus lectus
                  eleifend sem, eu malesuada ipsum arcu nec turpis.
                </p>
              </div>
              <div
                className={`${prefix}__wn_pattern__bubble_viewstack-view-buttons`}>
                <Button href="https://www.ibm.com" kind="ghost" size="sm">
                  Start using
                </Button>
              </div>
            </ScrollGradient>
          </View>
          <View title="Example View 2">
            <ScrollGradient>
              <img
                alt=""
                className={`${prefix}__wn_pattern__bubble_viewstack-view-image`}
                src="/whats-new-feature.svg"
              />
              <div
                className={`${prefix}__wn_pattern__bubble_viewstack-view-info`}>
                <Gift size={20} />
                <span>New!</span>
              </div>
              <div className={`${prefix}__wn_pattern__tag_container`}>
                <Tag
                  className="some-class"
                  size="md"
                  title="Clear filter"
                  type="purple">
                  Tag content
                </Tag>
              </div>
              <Heading
                className={`${prefix}__wn_pattern__bubble_viewstack-view-heading`}>
                Feature 2
              </Heading>
              <div
                className={`${prefix}__wn_pattern__bubble_viewstack-view-description`}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas consequat, nulla in laoreet molestie, metus lectus
                  eleifend sem, eu malesuada ipsum arcu nec turpis.
                </p>
              </div>
              <div
                className={`${prefix}__wn_pattern__bubble_viewstack-view-buttons`}>
                <Button href="https://www.ibm.com" kind="ghost" size="sm">
                  Start using
                </Button>
              </div>
            </ScrollGradient>
          </View>
        </ViewStack>
        <footer className={`${prefix}__wn_pattern__bubble_footer`}>
          <div className={`${prefix}__wn_pattern__bubble_progress`}>
            {currentReleaseNotifications}/{totalReleaseNotifications}
          </div>

          <Button
            disabled={currentReleaseNotifications === 1}
            size="sm"
            kind="ghost"
            onClick={() => {
              viewStackRef.current?.back();
            }}>
            Back
          </Button>
          {currentReleaseNotifications !== totalReleaseNotifications ? (
            <Button
              size="sm"
              kind="primary"
              onClick={() => {
                viewStackRef.current?.next();
              }}>
              Next
            </Button>
          ) : (
            <Button
              size="sm"
              kind="primary"
              onClick={() => {
                setShouldShowReleaseNotification(false);
              }}>
              Got it
            </Button>
          )}
        </footer>
      </Bubble>
      {/* Tier 1 - what's new center pattern */}
      <Toc ref={tocRef}>
        <Tearsheet
          selectorPrimaryFocus="#FeatureSwitcher"
          open={shouldShowAnnouncement}
          onClose={() => setShouldShowAnnouncement(false)}
          className={`${prefix}__wn_pattern__tearsheet`}>
          <Tearsheet.Header closeIconDescription="Close the tearsheet">
            <Tearsheet.HeaderContent title="What's new" />
            <Tearsheet.NavigationBar>
              <div
                className={`${prefix}__wn_pattern__tearsheet_navigation_container`}>
                <ContentSwitcher
                  id="FeatureSwitcher"
                  className={`${prefix}__wn_pattern__tearsheet__contentswitcher`}
                  size="md"
                  selectedIndex={contentIndex}
                  onChange={(val) => {
                    tocRef.current?.reset();
                    handleContentSwitch(val.index);
                  }}>
                  <Switch name="new" text="Latest highlights" />
                  <Switch name="all" text="All features" />
                </ContentSwitcher>
                <Link
                  className={`${prefix}__wn_pattern__tearsheet__link`}
                  size="md"
                  href="https://www.ibm.com"
                  target="_blank"
                  renderIcon={Launch}>
                  View on Docs
                </Link>
              </div>
            </Tearsheet.NavigationBar>
          </Tearsheet.Header>
          <Tearsheet.Influencer>
            <div
              className={`${prefix}__wn_pattern__tearsheet_influencer_container`}>
              {contentIndex === 0 ? (
                <TocList>
                  <TocItem>Feature 1</TocItem>
                  <TocItem>Feature 2</TocItem>
                </TocList>
              ) : (
                <TocList>
                  <TocItem>Section 1</TocItem>
                  <TocItem>Section 2</TocItem>
                </TocList>
              )}
            </div>
          </Tearsheet.Influencer>
          <Tearsheet.Body>
            <Tearsheet.MainContent>
              <div className={`${prefix}__wn_pattern__features`}>
                {contentIndex === 0 ? (
                  <TocSections
                    className={`${prefix}__wn_pattern__feature__sections`}
                    threshold={0.2}>
                    <TocSection
                      as="div"
                      className={`${prefix}__wn_pattern__feature__section`}>
                      <Section level={3}>
                        <img
                          className={`${prefix}__wn_pattern__feature__section_image`}
                          src="/whats-new-feature.svg"
                          aria-label="Example image"
                        />
                        <div className={`${prefix}__wn_pattern__tag_container`}>
                          <Tag
                            className="some-class"
                            size="md"
                            title="Clear filter"
                            type="purple">
                            Tag content
                          </Tag>
                        </div>
                        <Heading
                          className={`${prefix}__wn_pattern__feature__section_heading`}>
                          Feature 1
                        </Heading>
                        <div
                          className={`${prefix}__wn_pattern__feature__section_body`}>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Duis consequat rhoncus dolor non dapibus.
                            Proin eu tempus turpis. Aliquam ornare mi mi.
                            Pellentesque ac mattis diam.
                          </p>
                        </div>
                        <Button href="https://www.ibm.com" kind="tertiary">
                          Go Here
                        </Button>
                      </Section>
                    </TocSection>
                    <TocSection
                      as="div"
                      className={`${prefix}__wn_pattern__feature__section`}>
                      <Section level={3}>
                        <img
                          className={`${prefix}__wn_pattern__feature__section_image`}
                          src="/whats-new-feature.svg"
                          aria-label="Example image"
                        />
                        <div className={`${prefix}__wn_pattern__tag_container`}>
                          <Tag
                            className="some-class"
                            size="md"
                            title="Clear filter"
                            type="purple">
                            Tag content
                          </Tag>
                        </div>
                        <Heading
                          className={`${prefix}__wn_pattern__feature__section_heading`}>
                          Feature 2
                        </Heading>
                        <div
                          className={`${prefix}__wn_pattern__feature__section_body`}>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Duis consequat rhoncus dolor non dapibus.
                            Proin eu tempus turpis. Aliquam ornare mi mi.
                            Pellentesque ac mattis diam.
                          </p>
                        </div>
                        <Button href="https://www.ibm.com" kind="tertiary">
                          Go Here
                        </Button>
                      </Section>
                    </TocSection>
                  </TocSections>
                ) : (
                  <TocSections
                    className={`${prefix}__wn_pattern__feature__sections`}
                    threshold={0.1}>
                    <TocSection as="div">
                      <Section
                        level={3}
                        className={`${prefix}__wn_pattern__feature__section_group`}>
                        <Heading
                          className={`${prefix}__wn_pattern__feature__section_group_heading`}>
                          Section 1
                        </Heading>
                        <Section
                          className={`${prefix}__wn_pattern__feature__section`}>
                          <img
                            className={`${prefix}__wn_pattern__feature__section_image`}
                            src="/whats-new-feature.svg"
                            aria-label="Example image"
                          />
                          <div
                            className={`${prefix}__wn_pattern__tag_container`}>
                            <Tag
                              className="some-class"
                              size="md"
                              title="Clear filter"
                              type="purple">
                              Tag content
                            </Tag>
                          </div>
                          <Heading
                            className={`${prefix}__wn_pattern__feature__section_heading`}>
                            Section 1 - Feature 1
                          </Heading>
                          <div
                            className={`${prefix}__wn_pattern__feature__section_body`}>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Duis consequat rhoncus dolor non dapibus.
                              Proin eu tempus turpis. Aliquam ornare mi mi.
                              Pellentesque ac mattis diam.
                            </p>
                          </div>
                          <Button href="https://www.ibm.com" kind="tertiary">
                            Go Here
                          </Button>
                        </Section>
                        <Section
                          className={`${prefix}__wn_pattern__feature__section`}>
                          <img
                            className={`${prefix}__wn_pattern__feature__section_image`}
                            src="/whats-new-feature.svg"
                            aria-label="Example image"
                          />
                          <div
                            className={`${prefix}__wn_pattern__tag_container`}>
                            <Tag
                              className="some-class"
                              size="md"
                              title="Clear filter"
                              type="purple">
                              Tag content
                            </Tag>
                          </div>
                          <Heading
                            className={`${prefix}__wn_pattern__feature__section_heading`}>
                            Section 1 - Feature 2
                          </Heading>
                          <div
                            className={`${prefix}__wn_pattern__feature__section_body`}>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Duis consequat rhoncus dolor non dapibus.
                              Proin eu tempus turpis. Aliquam ornare mi mi.
                              Pellentesque ac mattis diam.
                            </p>
                          </div>
                          <Button href="https://www.ibm.com" kind="tertiary">
                            Go Here
                          </Button>
                        </Section>
                      </Section>
                    </TocSection>
                    <TocSection as="div">
                      <Section
                        level={3}
                        className={`${prefix}__wn_pattern__feature__section_group`}>
                        <Heading
                          className={`${prefix}__wn_pattern__feature__section_group_heading`}>
                          Section 2
                        </Heading>
                        <Section
                          className={`${prefix}__wn_pattern__feature__section`}>
                          <img
                            className={`${prefix}__wn_pattern__feature__section_image`}
                            src="/whats-new-feature.svg"
                            aria-label="Example image"
                          />
                          <div
                            className={`${prefix}__wn_pattern__tag_container`}>
                            <Tag
                              className="some-class"
                              size="md"
                              title="Clear filter"
                              type="purple">
                              Tag content
                            </Tag>
                          </div>
                          <Heading
                            className={`${prefix}__wn_pattern__feature__section_heading`}>
                            Section 2 - Feature 1
                          </Heading>
                          <div
                            className={`${prefix}__wn_pattern__feature__section_body`}>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Duis consequat rhoncus dolor non dapibus.
                              Proin eu tempus turpis. Aliquam ornare mi mi.
                              Pellentesque ac mattis diam.
                            </p>
                          </div>
                          <Button href="https://www.ibm.com" kind="tertiary">
                            Go Here
                          </Button>
                        </Section>
                        <Section
                          className={`${prefix}__wn_pattern__feature__section`}>
                          <img
                            className={`${prefix}__wn_pattern__feature__section_image`}
                            src="/whats-new-feature.svg"
                            aria-label="Example image"
                          />
                          <div
                            className={`${prefix}__wn_pattern__tag_container`}>
                            <Tag
                              className="some-class"
                              size="md"
                              title="Clear filter"
                              type="purple">
                              Tag content
                            </Tag>
                          </div>
                          <Heading
                            className={`${prefix}__wn_pattern__feature__section_heading`}>
                            Section 2 - Feature 2
                          </Heading>
                          <div
                            className={`${prefix}__wn_pattern__feature__section_body`}>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Duis consequat rhoncus dolor non dapibus.
                              Proin eu tempus turpis. Aliquam ornare mi mi.
                              Pellentesque ac mattis diam.
                            </p>
                          </div>
                          <Button href="https://www.ibm.com" kind="tertiary">
                            Go Here
                          </Button>
                        </Section>
                      </Section>
                    </TocSection>
                  </TocSections>
                )}
              </div>
            </Tearsheet.MainContent>
          </Tearsheet.Body>
        </Tearsheet>
      </Toc>
    </div>
  );
};
WhatsNewPattern.storyName = "What's new pattern";
// The Labs TocList renders its TocItem li elements inside a nav, not a list.
WhatsNewPattern.parameters = {
  a11y: { config: { rules: [{ id: 'listitem', enabled: false }] } },
};

// Opens the What's New center, so the a11y check (on document.body) also
// covers the Tearsheet, which renders in a portal.
WhatsNewPattern.play = async ({ canvas, userEvent }) => {
  await userEvent.click(
    canvas.getByRole('button', { name: "Open What's New center" })
  );
  const dialog = await within(document.body).findByRole('dialog');
  const modal = dialog.closest('.cds--modal');
  await waitFor(() => {
    expect(modal).toHaveClass('is-visible');
    expect(dialog).toBeVisible();
  });
  // Let the open transition end, so axe does not check a half-open state. A
  // transition that gets replaced rejects its promise, so settle, not all.
  // Endless animations (spinners) never finish, so skip them.
  expect(modal).not.toBeNull();
  await Promise.allSettled(
    (modal as Element)
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          animation.effect?.getComputedTiming().iterations !== Infinity
      )
      .map(({ finished }) => finished)
  );
  const tearsheet = within(dialog);
  await expect(
    tearsheet.getByRole('heading', { name: "What's new" })
  ).toBeVisible();
  await expect(
    tearsheet.getByRole('heading', { name: 'Feature 1' })
  ).toBeVisible();
  await expect(
    tearsheet.getByRole('tab', { name: 'Latest highlights' })
  ).toBeVisible();
};
