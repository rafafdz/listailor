SSH_DOMAIN=$PROD_DOMAIN
SSH_USERNAME=$PROD_USERNAME
DEPLOY_DIR=$PROD_DEPLOY_DIR
SSH_KEY=$PROD_SSH_KEY
SSH_PORT=$PROD_SSH_PORT
PERFORM_DEPLOY=$PROD_PERFORM_DEPLOY

if [ "$PERFORM_DEPLOY" != "true" ]; then
  echo "Skipping deploy"
  exit 0
fi

echo "Adding ssh host"

mkdir -p ~/.ssh/
echo "$SSH_KEY" > ~/.ssh/deploy.key

chmod 600 ~/.ssh/deploy.key
cat >>~/.ssh/config <<END
Host deploy
  HostName $SSH_DOMAIN
  User $SSH_USERNAME
  Port $SSH_PORT
  IdentityFile ~/.ssh/deploy.key
  StrictHostKeyChecking no
END

echo -n "$GITHUB_SHA" > .release-version

echo "Creating code payload"
zip -r payload.zip .

target="$SSH_DOMAIN:$DEPLOY_DIR"
echo "Copying code payload to ${target^^}"

scp -v payload.zip "deploy:$DEPLOY_DIR"

ssh -t deploy  <<EOF
  cd $DEPLOY_DIR
  find . -type f\
    ! -name 'payload.zip'\
    ! -name 'deploy.log'\
    ! -path './.env*'\
    ! -path './backend/.env'\
    ! -path './data*'\
    ! -path './config/master.key'\
    -exec rm -f {} +
  unzip -o payload.zip
  nohup scripts/deploy-server.sh > deploy.log 2>&1 &
EOF
