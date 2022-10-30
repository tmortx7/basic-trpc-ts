import { Box, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { ISite, SiteSchema } from "../../../schema/site.schema";

const initialValues = {
  site: "",
  siteAlias: "",
  description: "-",
  deptId: "",
};

const CreateSitePage: NextPage = () => {
  const router = useRouter();
  const mutation = trpc.site.add.useMutation();
  const deptQuery = trpc.department.list.useQuery();

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Site
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: ISite) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/site");
            }}
            validationSchema={toFormikValidationSchema(SiteSchema)}
          >
            {({ handleSubmit }) => (
              <Stack
                spacing={5}
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={400}
                p={6}
                m="10px auto"
                as="form"
                onSubmit={handleSubmit as any}
              >
                <SelectControl
                  label="Department"
                  name="deptId"
                  selectProps={{ placeholder: "Select Dept" }}
                >
                  {deptQuery.data?.map((deptx: any) => (
                    <option value={deptx.id}>{deptx.dept}</option>
                  ))}
                </SelectControl>
                <InputControl
                  name="site"
                  label="Name"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="siteAlias"
                  label="Alias"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="description"
                  label="Description"
                  inputProps={{ autoComplete: "off" }}
                />
                <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
              </Stack>
            )}
          </Formik>
        </Box>
      </Flex>
    </div>
  );
};

export default CreateSitePage;
