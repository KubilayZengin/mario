import { useEffect, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { TocEntry } from '../helpers/processHtml';
import { IconChevronRight } from '@tabler/icons-react';
import { colors } from '../style/theme';

const Container = styled.div`
  width: 100%;
  overflow: auto;
  padding-right: 18px;

  @media (max-width: 700px) {
    padding: 0;
  }
`;

const List = styled(motion.ul)`
  user-select: none;
  width: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-block: 6px;
`;

const Item = styled.li<{ isTitle?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;
  font-weight: normal;

  line-height: 1.4;
  font-size: 14px;
  margin-block: 6px;

  ${({ isTitle }) => isTitle ? css`
  padding-left: 0;
  font-weight: bold;
  ` : css`padding-left: 30px;`}

  @media (max-width: 700px) {
    padding: 0;
  }
`;

const Link = styled.a<{
  active?: boolean;
  isShowingChildren?: boolean;
  hasChildren?: boolean;
}>`
  color: ${({ active }) => (active ? colors.content.primary : colors.content.secondary)};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${colors.content.secondary};
  }

  display: flex;
  align-items: flex-start;

  svg {
    width: 14px;
    min-width: 14px;
    max-width: 14px;

    height: 14px;
    min-height: 14px;
    max-height: 14px;

    transition: transform 0.2s ease;
    transform: rotate(0);
    margin-right: 2px;
    margin-top: 2px;

    ${({ isShowingChildren }) =>
      isShowingChildren &&
      css`
        transform: rotate(90deg) translateY(1px);
      `}

    ${({ hasChildren }) =>
      !hasChildren &&
      css`
        opacity: 0;
      `}
  }

  @media (max-width: 700px) {
    text-align: center;
    justify-content: center;
    align-items: center;
    svg {
      display: none;
    }
  }
`;

const flattenToc = (toc: TocEntry[]): TocEntry[] =>
  toc.flatMap(({ id, text, children }) => [{ id, text }, ...(children ?? [])]);

const useActiveSection = (toc: TocEntry[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const allEntries = flattenToc(toc);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const topId = visible[0].target.id;

          // Debounce activeId update to avoid flicker
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setActiveId(topId);
          }, 250);
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1,
      },
    );

    allEntries.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toc]);

  return activeId;
};

const childVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const TableOfContents = ({
  toc,
  title,
}: {
  toc: TocEntry[];
  title: string;
}) => {
  const activeId = useActiveSection(toc);

  return (
    <Container>
      <List>
        <Item isTitle>
          <Link href="#top">
            <IconChevronRight />
            {title}
          </Link>
        </Item>
        {toc.map(({ id, text, children }) => {
          const isActive = id === activeId;
          const isChildActive = children?.some((c) => c.id === activeId);
          const showChildren = isActive || isChildActive;

          return (
            <Item key={id}>
              <Link
                href={`#${id}`}
                active={isActive}
                isShowingChildren={showChildren}
                hasChildren={!!children?.length}
              >
                <IconChevronRight />
                {text}
              </Link>
              <AnimatePresence initial={false}>
                {showChildren && children?.length ? (
                  <List
                    variants={childVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {children.map((child) => (
                      <Item key={child.id}>
                        <Link
                          href={`#${child.id}`}
                          active={child.id === activeId}
                        >
                          {child.text}
                        </Link>
                      </Item>
                    ))}
                  </List>
                ) : null}
              </AnimatePresence>
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

export default TableOfContents;
