import { forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from 'components/icons/search';
import type { Contact } from 'types/chat';
import { Tip } from 'components/tip';
import useTransition from 'next-translate/useTranslation';

interface ChatContactSearchProps {
  isFocused?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickAway?: () => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onSelect?: (result: Contact) => void;
  query?: string;
  results: Contact[];
}

// eslint-disable-next-line react/display-name
export const ChatContactSearch = forwardRef<HTMLDivElement, ChatContactSearchProps>((
  props,
  ref
) => {
  const {t} = useTransition("chatting");

  const { isFocused, onChange, onClickAway, onFocus, onSelect, query, results, ...other } = props;

  const displaySearchResults = query && isFocused;

  const handleSelect = (result: Contact): void => {
    if (onSelect) {
      onSelect(result);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => onClickAway?.()}>
      <Box
        ref={ref}
        sx={{ p: 2 }}
        {...other}
      >
        <TextField
          fullWidth
          onChange={onChange}
          onFocus={onFocus}
          placeholder={t("SearchContacts")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          value={query}
        />
        {Boolean(isFocused && !query) && (
          <Box sx={{ py: 2 }}>
            <Tip message={t("ContactsTips")} />
          </Box>
        )}
        {Boolean(displaySearchResults && results.length === 0) && (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              {t("SearchNobody", {query: query})}
            </Typography>
          </Box>
        )}
        {(displaySearchResults && results.length > 0) && (
          <Box sx={{ py: 2 }}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
            >
              {t("Contacts")}
            </Typography>
            <List>
              {results.map((result) => (
                <ListItem
                  button
                  key={result.userSid}
                  onClick={(): void => handleSelect(result)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={result.avatar}
                      sx={{
                        height: 32,
                        width: 32
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={result.userNm}
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: 'subtitle2'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
});

ChatContactSearch.propTypes = {
  isFocused: PropTypes.bool,
  onChange: PropTypes.func,
  onClickAway: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array.isRequired
};

ChatContactSearch.defaultProps = {
  isFocused: false,
  query: '',
  results: []
};
