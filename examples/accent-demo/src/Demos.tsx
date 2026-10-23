import {
  Accordion,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  ClickableTile,
  ComboBox,
  ContentSwitcher,
  DataTable,
  DatePicker,
  DatePickerInput,
  Dropdown,
  IconButton,
  InlineNotification,
  Link,
  Loading,
  Modal,
  MultiSelect,
  NumberInput,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  ProgressBar,
  ProgressIndicator,
  ProgressStep,
  RadioButton,
  RadioButtonGroup,
  Search,
  SelectableTile,
  Slider,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  Tabs,
  Tag,
  TextInput,
  Toggle,
  ToastNotification,
  ActionableNotification,
} from '@afframe/ui';
import { Add } from '@afframe/ui/icons';
import { useState } from 'react';

const items = ['Option one', 'Option two', 'Option three'];
const rows = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' },
];

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        kind="primary"
        onClick={() => setOpen(true)}
        data-testid="open-modal">
        Open modal
      </Button>
      <Modal
        open={open}
        modalHeading="Modal"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestClose={() => setOpen(false)}
        onRequestSubmit={() => setOpen(false)}>
        <p>Primary button inside the modal.</p>
      </Modal>
    </>
  );
}

export type Demo = { id: string; follows: boolean; node: React.ReactNode };

export const demos: Demo[] = [
  { id: 'button-primary', follows: true, node: <Button>Primary</Button> },
  {
    id: 'button-secondary',
    follows: false,
    node: <Button kind="secondary">Secondary</Button>,
  },
  {
    id: 'button-tertiary',
    follows: false,
    node: <Button kind="tertiary">Tertiary</Button>,
  },
  {
    id: 'button-ghost',
    follows: true,
    node: <Button kind="ghost">Ghost</Button>,
  },
  {
    id: 'icon-button',
    follows: true,
    node: (
      <IconButton label="Add" kind="primary">
        <Add />
      </IconButton>
    ),
  },
  { id: 'link', follows: true, node: <Link href="#">Link</Link> },
  {
    id: 'text-input',
    follows: true,
    node: <TextInput id="d-ti" labelText="TextInput" placeholder="focus" />,
  },
  {
    id: 'toggle',
    follows: false,
    node: <Toggle id="d-tg" labelText="Toggle" defaultToggled />,
  },
  {
    id: 'checkbox',
    follows: false,
    node: <Checkbox id="d-cb" labelText="Checkbox" defaultChecked />,
  },
  {
    id: 'radio',
    follows: false,
    node: (
      <RadioButtonGroup
        name="rg"
        legendText="RadioButtonGroup"
        defaultSelected="1">
        <RadioButton labelText="One" value="1" id="r1" />
        <RadioButton labelText="Two" value="2" id="r2" />
      </RadioButtonGroup>
    ),
  },
  {
    id: 'tabs',
    follows: true,
    node: (
      <Tabs>
        <TabList aria-label="t">
          <Tab>One</Tab>
          <Tab>Two</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>1</TabPanel>
          <TabPanel>2</TabPanel>
        </TabPanels>
      </Tabs>
    ),
  },
  {
    id: 'progress-indicator',
    follows: true,
    node: (
      <ProgressIndicator currentIndex={1}>
        <ProgressStep label="Done" />
        <ProgressStep label="Current" />
        <ProgressStep label="Next" />
      </ProgressIndicator>
    ),
  },
  {
    id: 'progress-bar',
    follows: true,
    node: <ProgressBar label="ProgressBar" value={60} max={100} />,
  },
  { id: 'loading', follows: true, node: <Loading withOverlay={false} small /> },
  {
    id: 'slider',
    follows: false,
    node: <Slider id="d-sl" labelText="Slider" min={0} max={100} value={40} />,
  },
  { id: 'tag', follows: false, node: <Tag type="blue">Tag blue</Tag> },
  {
    id: 'notification-info',
    follows: false,
    node: (
      <InlineNotification
        kind="info"
        title="Info"
        subtitle="Inline"
        hideCloseButton
      />
    ),
  },
  {
    id: 'notification-actionable',
    follows: false,
    node: (
      <ActionableNotification
        kind="info"
        title="Info"
        subtitle="Actionable"
        actionButtonLabel="Action"
        hideCloseButton
        inline
      />
    ),
  },
  {
    id: 'toast',
    follows: false,
    node: (
      <ToastNotification
        kind="info"
        title="Toast"
        subtitle="Info toast"
        hideCloseButton
      />
    ),
  },
  {
    id: 'overflow-menu',
    follows: false,
    node: (
      <OverflowMenu aria-label="menu" flipped>
        <OverflowMenuItem itemText="One" />
        <OverflowMenuItem itemText="Two" />
      </OverflowMenu>
    ),
  },
  {
    id: 'dropdown',
    follows: false,
    node: (
      <Dropdown
        id="d-dd"
        label="Dropdown"
        titleText="Dropdown"
        items={items}
        initialSelectedItem={items[0]}
      />
    ),
  },
  {
    id: 'combobox',
    follows: false,
    node: (
      <ComboBox
        id="d-cbx"
        onChange={() => {}}
        titleText="ComboBox"
        items={items}
        initialSelectedItem={items[0]}
      />
    ),
  },
  {
    id: 'multiselect',
    follows: false,
    node: (
      <MultiSelect
        id="d-ms"
        label="MultiSelect"
        titleText="MultiSelect"
        items={items}
        initialSelectedItems={[items[0]!, items[1]!]}
      />
    ),
  },
  {
    id: 'datepicker',
    follows: true,
    node: (
      <DatePicker datePickerType="single" value="01/15/2026">
        <DatePickerInput
          id="d-dp"
          labelText="DatePicker (open it: selected day)"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>
    ),
  },
  {
    id: 'search',
    follows: false,
    node: <Search labelText="Search" placeholder="Search" size="md" />,
  },
  {
    id: 'number-input',
    follows: false,
    node: (
      <NumberInput id="d-ni" label="NumberInput" value={3} min={0} max={10} />
    ),
  },
  {
    id: 'pagination',
    follows: false,
    node: (
      <Pagination
        totalItems={100}
        pageSize={10}
        pageSizes={[10, 20]}
        page={1}
      />
    ),
  },
  {
    id: 'data-table',
    follows: true,
    node: (
      <DataTable rows={rows} headers={[{ key: 'name', header: 'Name' }]}>
        {({
          rows: r,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getBatchActionProps,
          getTableProps,
          getToolbarProps,
        }: any) => (
          <TableContainer>
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction onClick={() => {}}>Delete</TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <span />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((h: any) => {
                    const { key, ...p } = getHeaderProps({ header: h });
                    return (
                      <TableHeader key={key} {...p}>
                        {h.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {r.map((row: any) => {
                  const { key, ...p } = getRowProps({ row });
                  return (
                    <TableRow key={key} {...p}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row.cells.map((c: any) => (
                        <TableCell key={c.id}>{c.value}</TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    ),
  },
  {
    id: 'content-switcher',
    follows: false,
    node: (
      <ContentSwitcher selectedIndex={0} onChange={() => {}}>
        <Switch name="a" text="First" />
        <Switch name="b" text="Second" />
      </ContentSwitcher>
    ),
  },
  {
    id: 'accordion',
    follows: false,
    node: (
      <Accordion>
        <AccordionItem title="Accordion" open>
          Content
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    id: 'tile-selectable',
    follows: false,
    node: (
      <SelectableTile id="d-st" selected>
        Selectable tile (selected)
      </SelectableTile>
    ),
  },
  {
    id: 'tile-clickable',
    follows: false,
    node: <ClickableTile href="#">Clickable tile</ClickableTile>,
  },
  {
    id: 'breadcrumb',
    follows: true,
    node: (
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#" isCurrentPage>
          Page
        </BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  { id: 'modal', follows: true, node: <ModalDemo /> },
];
