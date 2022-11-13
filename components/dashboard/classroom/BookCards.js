import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  Link,
  VStack,
} from '@chakra-ui/react';

const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

export default function BookCards({ data }) {
  console.log(data.items[0]);
  return (
    <>
      <Center py={2}>
        <VStack spacing="10px">
          <Heading fontSize={'4xl'} mb={'6'}>
            Google Books Recommendation
          </Heading>
          <Stack direction={['column', 'row']} spacing="10px">
            {data.items.map((item) => {
              var thumbnail =
                item.volumeInfo.imageLinks &&
                item.volumeInfo.imageLinks.smallThumbnail;
              var title = item.volumeInfo.title;
              // var cost =
              //   item.saleInfo.listPrice && item.saleInfo.listPrice.amount;
              var category =
                item.volumeInfo.categories && item.volumeInfo.categories[0];
              var previewLink = item.volumeInfo.previewLink;
              console.log(thumbnail);
              console.log({ previewLink });
              return (
                <>
                  <Link href={previewLink} isExternal>
                    <Box
                      role={'group'}
                      p={6}
                      maxW={'300px'}
                      h={'full'}
                      w={'full'}
                      bg={'white'}
                      boxShadow={'2xl'}
                      rounded={'lg'}
                      pos={'relative'}
                      zIndex={1}
                    >
                      <Box
                        rounded={'lg'}
                        mt={-10}
                        pos={'relative'}
                        height={'200px'}
                        _after={{
                          transition: 'all .3s ease',
                          content: '""',
                          w: 'full',
                          h: 'full',
                          pos: 'absolute',
                          top: 5,
                          left: 0,
                          //   backgroundImage: `url(${})`,
                          filter: 'blur(15px)',
                          zIndex: -1,
                        }}
                        _groupHover={{
                          _after: {
                            filter: 'blur(20px)',
                          },
                        }}
                      >
                        <Image
                          rounded={'lg'}
                          height={230}
                          width={282}
                          objectFit={'cover'}
                          src={thumbnail}
                          alt={'book'}
                        />
                      </Box>
                      <Stack pt={10} align={'center'}>
                        <Text
                          color={'gray.500'}
                          fontSize={'sm'}
                          textTransform={'uppercase'}
                        >
                          {category}
                        </Text>
                        <Heading
                          fontSize={'sm'}
                          fontFamily={'body'}
                          fontWeight={500}
                        >
                          {title}
                        </Heading>
                        <Stack direction={'row'} align={'center'}>
                          {/* <Text fontWeight={800} fontSize={'xl'}>
                          ₹{cost}
                        </Text> */}
                          {/* <Text textDecoration={'line-through'} color={'gray.600'}>
                        $169
                      </Text> */}
                        </Stack>
                      </Stack>
                    </Box>
                  </Link>
                </>
              );
            })}
          </Stack>
        </VStack>
      </Center>
    </>
  );
}
