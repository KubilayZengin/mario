import { useMemo } from 'react';
import { styled } from 'styled-components';

import { IconCalendar, IconClock, IconPrinter } from '@tabler/icons-react';
import { colors } from '../style/theme';

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 8px;
  color: ${colors.content.secondary};
  opacity: 0.6;

  @media (max-width: 700px) {
    justify-content: center;
  }

  @media print {
    margin-top: 48px;
  }
`;

const Item = styled.div`
  user-select: none;
  display: flex;
  align-items: center;

  font-size: 14px;
  line-height: 1;

  svg {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
`;

const PrintItem = styled(Item)`
  cursor: pointer;
`;

const MetadataRibbon = ({
  dateCreated,
  html,
}: {
  dateCreated: string;
  html: string;
}) => {
  const readingTimeMinutes = useMemo(() => {
    const averageWordsPerMinute = 200;
    const plainText = html.replace(/<[^>]+>/g, '').trim();
    const wordCount = plainText.split(/\s+/).length;
    const totalMinutes = wordCount / averageWordsPerMinute;
    return Math.floor(totalMinutes);
  }, [html]);

  return (
    <Row>
      <Item>
        <IconCalendar />
        {dateCreated}
      </Item>
      <Item>
        <IconClock />
        {`${readingTimeMinutes} minute read`}
      </Item>
      <PrintItem onClick={() => window.print()}>
        <IconPrinter />
        Print
      </PrintItem>
    </Row>
  );
};

export default MetadataRibbon;
