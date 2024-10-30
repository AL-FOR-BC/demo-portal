import { useEffect } from 'react'
import Header from '../../Components/ui/Header/Header';
import { useAppSelector } from '../../store/hook';
import { useNavigate } from 'react-router-dom';

function AppSetup() {
  const { isAdmin, isBcAdmin } = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdmin && !isBcAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isBcAdmin, navigate]);


  const fields = [
    [
      {
        name: 'App Name',
        value: 'App Name',
        type: 'text',
        required: true,
      },

    ]

  ]
  const handleSubmit = () => {
    console.log('submit')
  }
  return (


    <Header title="App Setup"
      subtitle="App Setup"
      breadcrumbItem="App Setup"
      isLoading={false}
      pageType='add'
      fields={fields}
      handleSubmit={handleSubmit}
    />
  )
}

export default AppSetup