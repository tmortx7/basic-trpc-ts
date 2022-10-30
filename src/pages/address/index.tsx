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

const AddressListPage: NextPage = () => {
  const utils = trpc.useContext();
  const mutation = trpc.address.delete.useMutation({
    async onSuccess() {
      await utils.address.list.invalidate();
    },
  });
  const { data, isLoading, error } = trpc.address.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }
  if (error) {
    return <p>Error...</p>;
  }

  return (
    <div>
      <Head>
        <title>List of Addresses</title>
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
                    <Th>address 1</Th>
                    <Th>address 1</Th>
                    <Th>plus code</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(({ id, add1, add2, plusCode }) => (
                    <Tr key={id}>
                      <Td>{add1}</Td>
                      <Td>{add2}</Td>
                      <Td>{plusCode}</Td>
                      <Td>
                        <LinkBox>
                          <LinkOverlay href={`/address/edit/${id}`}>
                            <IconButton
                              aria-label="Delete address"
                              size="sm"
                              icon={<EditIcon />}
                            />
                          </LinkOverlay>
                        </LinkBox>
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Delete address"
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

export default AddressListPage;
