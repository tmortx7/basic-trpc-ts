import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  LinkBox,
  LinkOverlay,
  HStack,
} from "@chakra-ui/react";
import { trpc } from "../utils/trpc";

const ListItemValue = ({ item }) => {
  return (
    <>
      <MenuItem>{item}</MenuItem>
    </>
  );
};

const DropDownPage = () => {
  const { data, isLoading } = trpc.site.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }
  return (
    <div>
      <Flex minWidth="max-content" alignItems="center" gap="2" h={16}>
        <HStack spacing={8} alignItems={"center"}>
          <Box p="2">
            <Heading size="md">Chakra App</Heading>
          </Box>
          <ButtonGroup gap="2">
            <Menu>
              <MenuButton>Site</MenuButton>

              <MenuList>
                {data.map((item: any) => (
                  <LinkBox>
                    <LinkOverlay href={`/site/edit/${item.id}`}>
                      <ListItemValue key={item.id} item={item.site} />
                    </LinkOverlay>
                  </LinkBox>
                ))}
              </MenuList>
            </Menu>
          </ButtonGroup>
        </HStack>
      </Flex>
    </div>
  );
};

export default DropDownPage;
