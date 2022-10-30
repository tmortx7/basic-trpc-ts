import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Flex,
  IconButton,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const SiteListPage: NextPage = () => {
  const utils = trpc.useContext();
  const mutation = trpc.site.delete.useMutation({
    async onSuccess() {
      await utils.site.list.invalidate();
    },
  });
  const { data, isLoading, error } = trpc.site.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }
  if (error) {
    return <p>Error...</p>;
  }

  return (
    <div>
      <Head>
        <title>List of Sites</title>
        <meta name="description" content="instrument function" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex bg="gray.100" align="center" justify="center" h="100vh">
          <Box>
            <TableContainer>
              <Table variant="striped" colorScheme="gray 300">
                <Thead>
                  <Tr>
                    <Th>Site</Th>
                    <Th>Alias</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(({ id, site, siteAlias }) => (
                    <Tr key={id}>
                      <Td>{site}</Td>
                      <Td>{siteAlias}</Td>
                      <Td>
                        <LinkBox>
                          <LinkOverlay href={`/site/edit/${id}`}>
                            <IconButton
                              aria-label="Delete site"
                              size="sm"
                              icon={<EditIcon />}
                            />
                          </LinkOverlay>
                        </LinkBox>
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Delete site"
                          size="sm"
                          icon={<DeleteIcon />}
                          onClick={() => mutation.mutate({ id })}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </main>
    </div>
  );
};

export default SiteListPage;
