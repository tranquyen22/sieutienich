import { execSync } from 'child_process';

function autoPush() {
  try {
    console.log('🔍 Checking Git status...');
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    
    if (status.trim().length === 0) {
      console.log('✅ No uncommitted changes found.');
    } else {
      console.log('📦 Staging files...');
      execSync('git add .');
      
      const timestamp = new Date().toLocaleString('vi-VN');
      const commitMessage = `Auto update: ${timestamp}`;
      console.log(`💬 Committing with message: "${commitMessage}"...`);
      execSync(`git commit -m "${commitMessage}"`);
    }

    // Check if remote 'origin' exists
    try {
      const remotes = execSync('git remote', { encoding: 'utf-8' });
      if (remotes.includes('origin')) {
        console.log('🚀 Pushing to GitHub (origin/main)...');
        execSync('git push origin main');
        console.log('🎉 Successfully pushed to GitHub!');
      } else {
        console.log('⚠️ Remote "origin" is not configured yet.');
        console.log('👉 Please run: git remote add origin <YOUR_GITHUB_REPO_URL>');
      }
    } catch (pushErr) {
      console.warn('⚠️ Could not push to GitHub:', pushErr.message);
    }
  } catch (err) {
    console.error('❌ Error during auto push:', err.message);
  }
}

autoPush();
