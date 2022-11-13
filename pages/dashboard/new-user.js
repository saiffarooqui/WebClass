import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Form from '../../components/new-user/Form';
import DashboardLayout from '../../layout/DashboardLayout';
import connectDatabase from '../../lib/db';
import User from '../../models/User';

function NewUserPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>WebClass - New User</title>
      </Head>
      <Form />
    </DashboardLayout>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  connectDatabase();

  const userData = await User.findOne({ email: session.user.email });

  if (userData !== null) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default NewUserPage;
