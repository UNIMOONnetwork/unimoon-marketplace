import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Skeleton, Carousel, List, Card } from 'antd';
import { Redirect } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { useProfileContext } from '../../contexts/profile';
import profileService from '../../services/profile';
// import { useNotiStack } from '../../components/NotiStack';
// import Input from '../../components/Input';
// import { Preview } from '../../components/Preview';

export const EditProfilePage = () => {
  const wallet = useWallet();
  const { connected } = useWallet();
  // const { displayMessage } = useNotiStack();

  const { profile } = useProfileContext();

  const [profileAvatar, setProfileAvatar] =
    useState<string | ArrayBuffer | null | undefined>();
  const [rawAvatar, setRawAvatar] = useState<string>('');
  const [profileName, setProfileName] = useState<string>();
  const [profileUrl, setProfileUrl] = useState<string>();
  const [profileBio, setProfileBio] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const userId = wallet?.publicKey?.toString();

  const handleFileSelect = ({ target }) => {
    if (target.files) {
      const reader = new FileReader();
      reader.onload = () => setProfileAvatar(reader.result); //to preview avatar
      reader.readAsDataURL(target.files[0]);

      setRawAvatar(target.files[0]); //to upload avatar
    }
  };

  const displayErrorMessage = () => {
    // displayMessage({
    //   status: 'error',
    //   message: 'There was an error updating your profile',
    // });
  };

  const displayWalletMessage = () => {
    // displayMessage({
    //   status: 'info',
    //   message: 'Please connect to wallet',
    // });
  };

  const handleSubmit = async () => {
    setLoading(true);

    let avatarUrl = '';
    let bannerUrl = '';

    if (wallet?.publicKey) {
      if (profile) {
        if (rawAvatar != '') {
          // avatarUrl = await profileService.uploadImageToS3(rawAvatar);
        }

        const profileObject = {
          name: profileName,
          description: profileBio,
          ownerId: wallet?.publicKey?.toString(),
          profileId: profileUrl,
          banner_url: bannerUrl == '' ? profile.banner_url : bannerUrl,
          imageUrl: avatarUrl == '' ? profile.imageUrl : avatarUrl,
          followers: profile.followers,
          following: profile.following,
          member_since: profile.member_since,
          on_sale: profile.on_sale,
          collectible: profile.collectible,
          created: profile.created,
          liked: profile.liked,
          activity: profile.activity,
        };

      //   profileService
      //     .updateProfile(wallet?.publicKey?.toBase58(), profileObject)
      //     .then((res: any) => {
      //       // displayMessage(res);
      //     })
      //     .catch(err => {
      //       if (err && err.message) {
      //         // displayMessage(err);
      //       } else {
      //         // displayErrorMessage();
      //       }
      //     })
      //     .finally(() => {
      //       setLoading(false);
      //     });
      }
    } else {
      displayWalletMessage();
      return;
    }
  };

  useEffect(() => {
    if (profile) {
      setProfileAvatar(profile.imageUrl);
      setProfileName(profile.name);
      setProfileUrl(profile.profileId);
      setProfileBio(profile.description);
    }
  }, [profile]);

  if (!userId) {
    return <Redirect to={'/'} />;
  }

  return (
    <>
      <div className="editProfilePage">
        <Content>
        <Col>
          <Row ref={ref}>
            <Col xs={{ span: 24 }} md={{ span: 12 }} style={{ padding: '30px' }}>
              <ArtContent
                style={{ width: '300px', height: '300px', margin: '0 auto' }}
                height={300}
                width={300}
                className="artwork-image"
                pubkey={id}
                active={true}
                allowMeshRender={true}
                artView={true}
              />
            </Col>
            {/* <Divider /> */}
            <Col
              xs={{ span: 24 }}
              md={{ span: 12 }}
              style={{ textAlign: 'left', fontSize: '1.4rem' }}
            >
              <Row>
                <div style={{ fontWeight: 700, fontSize: '4rem' }}>
                  {art.title || <Skeleton paragraph={{ rows: 0 }} />}
                </div>
              </Row>
              <Row>
                <Col span={6}>
                  <h6>Royalties</h6>
                  <div className="royalties">
                    {((art.seller_fee_basis_points || 0) / 100).toFixed(2)}%
                  </div>
                </Col>
                <Col span={12}>
                  <ViewOn id={id} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6 style={{ marginTop: 5 }}>Created By</h6>
                  <div className="creators">
                    {(art.creators || []).map((creator, idx) => {
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}
                        >
                          <MetaAvatar creators={[creator]} size={64} />
                          <div>
                            <span className="creator-name">
                              {creator.name ||
                                shortenAddress(creator.address || '')}
                            </span>
                            <div style={{ marginLeft: 10 }}>
                              {!creator.verified &&
                                (creator.address === pubkey ? (
                                  <Button
                                    onClick={async () => {
                                      try {
                                        await sendSignMetadata(
                                          connection,
                                          wallet,
                                          id,
                                        );
                                      } catch (e) {
                                        console.error(e);
                                        return false;
                                      }
                                      return true;
                                    }}
                                  >
                                    Approve
                                  </Button>
                                ) : (
                                  tag
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6 style={{ marginTop: 5 }}>Edition</h6>
                  <div className="art-edition">{badge}</div>
                </Col>
              </Row>

              {/* <Button
                    onClick={async () => {
                      if(!art.mint) {
                        return;
                      }
                      const mint = new PublicKey(art.mint);

                      const account = accountByMint.get(art.mint);
                      if(!account) {
                        return;
                      }

                      const owner = wallet.publicKey;

                      if(!owner) {
                        return;
                      }
                      const instructions: any[] = [];
                      await updateMetadata(undefined, undefined, true, mint, owner, instructions)

                      sendTransaction(connection, wallet, instructions, [], true);
                    }}
                  >
                    Mark as Sold
                  </Button> */}

              {/* TODO: Add conversion of MasterEditionV1 to MasterEditionV2 */}
              <ArtMinting
                id={id}
                key={remountArtMinting}
                onMint={async () => await setRemountArtMinting(prev => prev + 1)}
              />
            </Col>
            <Col span="12">
              <Divider />
              {art.creators?.find(c => !c.verified) && unverified}
              <br />
              <div className="info-header">ABOUT THE CREATION</div>
              <div className="info-content">{description}</div>
              <br />
              {/*
                TODO: add info about artist
              <div className="info-header">ABOUT THE CREATOR</div>
              <div className="info-content">{art.about}</div> */}
            </Col>
            <Col span="12">
              {attributes && (
                <>
                  <Divider />
                  <br />
                  <div className="info-header">Attributes</div>
                  <List size="large" grid={{ column: 4 }}>
                    {attributes.map(attribute => (
                      <List.Item key={attribute.trait_type}>
                        <Card title={attribute.trait_type}>
                          {attribute.value}
                        </Card>
                      </List.Item>
                    ))}
                  </List>
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Content>
      </div>
    </>
  );
};
